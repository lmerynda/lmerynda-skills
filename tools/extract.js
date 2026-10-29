// Extract the user's typed prompts from Claude Code and Codex transcripts, each with the agent text it answered.
//
// usage: node tools/extract.js --out <file.jsonl|file.tsv> [--since 7d|<ISO>] [--idle-hours 2] [--state <state.json>]
//
// With --state, each session resumes after the last prompt a previous run took from it, and the
// updated marks go to <out>.next-state.json. Copy that over the state file only once the run that
// consumed the batch has finished, so a failed run is retried next time.
const fs = require('fs'), path = require('path'), os = require('os'), zlib = require('zlib');

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') && acc.push([a.slice(2), all[i + 1]]), acc), []));
if (!args.out) { console.error('--out is required'); process.exit(2); }
const now = Date.now();
const idleMs = Number(args['idle-hours'] ?? 0) * 3600e3;
const since = !args.since ? 0 : /^\d+d$/.test(args.since) ? now - parseInt(args.since) * 86400e3 : Date.parse(args.since);
const state = args.state && fs.existsSync(args.state) ? JSON.parse(fs.readFileSync(args.state, 'utf8')) : { sessions: {} };
const home = os.homedir();

// Scheduled sweep and digest runs start with these markers; mining them would make the loop reflect on itself.
const SELF = /\[lmerynda-(sweep|digest)\]/;
const NOISE = /^(<|# AGENTS\.md|Caveat:|\[Request interrupted|This session is being continued|<command-|Base directory for this skill|You are judging|<environment_context>|<user_instructions>|<turn_aborted>)/;

function walk(d, pred, acc = []) {
  if (!fs.existsSync(d)) return acc;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'subagents') walk(p, pred, acc); } else if (pred(p)) acc.push(p);
  }
  return acc;
}

function lines(p) {
  let buf = fs.readFileSync(p);
  if (p.endsWith('.zst')) buf = zlib.zstdDecompressSync(buf);
  return buf.toString('utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

function clean(text) {
  return String(text).replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')
    .replace(/<pasted_content[\s\S]*?<\/pasted_content[^>]*>/g, '[paste]').replace(/\s+/g, ' ').trim();
}

// Each parser yields { ts, text, prev } for the user's typed prompts, in order.
function* claudeSession(events) {
  let prev = '';
  for (const o of events) {
    if (o.isSidechain || !o.message) continue;
    const c = o.message.content;
    const texts = typeof c === 'string' ? [c] : Array.isArray(c) ? c.filter(b => b.type === 'text').map(b => b.text) : [];
    if (o.type === 'assistant') { const t = clean(texts.join(' ')); if (t) prev = t; continue; }
    if (o.type !== 'user' || o.isMeta) continue;
    for (const t of texts) if (!NOISE.test(t.trim())) yield { ts: o.timestamp, text: clean(t), prev, cwd: o.cwd };
  }
}

function* codexSession(events) {
  let prev = '', awaiting = false;
  for (const o of events) {
    const p = o.payload || {};
    if (o.type === 'event_msg' && p.type === 'task_started') {
      awaiting = /^(composer|user|remote)/.test((p.turn_attribution && p.turn_attribution.turn_trigger) || 'user');
    }
    if (o.type === 'response_item' && p.type === 'message' && p.role === 'assistant') {
      const a = clean((p.content || []).filter(b => b.type === 'output_text').map(b => b.text).join(' '));
      if (a) prev = a;
    }
    if (!awaiting) continue;
    const user = o.type === 'event_msg' && p.type === 'user_message' ? [p.message]
      : o.type === 'response_item' && p.type === 'message' && p.role === 'user' ? (p.content || []).filter(b => b.type === 'input_text').map(b => b.text) : [];
    const t = user.find(u => u && !NOISE.test(String(u).trim()));
    if (t) { yield { ts: o.timestamp, text: clean(t), prev }; awaiting = false; }
  }
}

function codexProject(events) {
  const meta = events.find(o => (o.type === 'session_meta' || o.type === 'turn_context') && o.payload && o.payload.cwd);
  return meta ? path.basename(meta.payload.cwd.replace(/\\/g, '/')) : '?';
}

const sources = [
  ...walk(path.join(home, '.claude', 'projects'), p => p.endsWith('.jsonl')).map(f => ({ tool: 'claude', f })),
  ...walk(path.join(home, '.codex', 'sessions'), p => p.endsWith('.jsonl')).map(f => ({ tool: 'codex', f })),
  ...walk(path.join(home, '.codex', 'archived_sessions'), p => /\.jsonl(\.zst)?$/.test(p)).map(f => ({ tool: 'codex', f })),
];

const rows = [], next = { sessions: { ...state.sessions } };
let skippedActive = 0, skippedSelf = 0;
for (const { tool, f } of sources) {
  const mtime = fs.statSync(f).mtimeMs;
  if (mtime < since) continue;
  if (now - mtime < idleMs) { skippedActive++; continue; }
  const id = path.basename(f).replace(/\.jsonl(\.zst)?$/, '');
  const mark = state.sessions[id] ? Date.parse(state.sessions[id]) : since;
  const events = lines(f);
  const prompts = [...(tool === 'claude' ? claudeSession(events) : codexSession(events))];
  if (prompts.length && SELF.test(prompts[0].text)) { skippedSelf++; continue; }
  const project = tool === 'codex' ? codexProject(events) : path.basename(String((prompts.find(p => p.cwd) || {}).cwd || path.dirname(f)));
  const fresh = prompts.filter(p => p.text && Date.parse(p.ts) > mark);
  for (const p of fresh) rows.push({ tool, session: id, project, ts: p.ts, prev: p.prev.slice(0, 400), text: p.text.slice(0, 1500) });
  if (fresh.length) next.sessions[id] = fresh[fresh.length - 1].ts;
}

rows.sort((a, b) => a.ts.localeCompare(b.ts));
fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true });
fs.writeFileSync(args.out, args.out.endsWith('.tsv')
  ? rows.map(r => [r.tool, r.ts.slice(0, 10), r.project, r.text.slice(0, 600)].join('\t')).join('\n')
  : rows.map(r => JSON.stringify(r)).join('\n'));
if (args.state) fs.writeFileSync(args.out + '.next-state.json', JSON.stringify(next, null, 1));
const sessions = new Set(rows.map(r => r.session)).size;
console.log(`${rows.length} prompts from ${sessions} sessions; skipped ${skippedActive} active, ${skippedSelf} sweep/digest runs`);
