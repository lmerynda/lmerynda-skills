// Port selected pstack skills and playbooks into lmerynda-skills, swapping Cursor specifics for Claude Code and Codex.
// usage: node tools/port-pstack.js <pstack/skills dir> <lmerynda-skills repo>
const fs = require('fs'), path = require('path');
const [src, repo] = process.argv.slice(2);

const SKILLS = ['architect', 'arena', 'automate-me', 'benchmark-checklist', 'blast-radius', 'bro', 'correct', 'create-verification-skill',
  'figure-it-out', 'how', 'in-your-own-words', 'interrogate', 'ketchup', 'maintain-verification-skill', 'recall', 'reflect',
  'sharpen', 'show-me-your-work', 'swarm', 'tdd',
  ...fs.readdirSync(src).filter(d => d.startsWith('principle-'))];
const PLAYBOOKS = ['authoring-a-skill', 'autonomous-run', 'bug-fix', 'eval', 'feature', 'hillclimb', 'investigation', 'pause-safely',
  'perf-issue', 'prototype', 'refactoring', 'runtime-forensics', 'session-pickup', 'trace-forensics'];
// Skills whose second model seat is a different family (pstack's grok seat). Elsewhere grok is the fast code model.
const CROSS_FAMILY = new Set(['arena', 'architect']);

function rules(skill, inPlaybook) {
  const ref = inPlaybook ? 'references' : '../lmerynda-mode/references';
  const roles = `\`${ref}/model-roles.md\``, harness = `\`${ref}/harness.md\``;
  return [
    [/the `([^`]+)` line in (?:the )?`?(?:~\/\.cursor\/rules\/)?pstack-models\.mdc`?(?: rule)?/g, `the \`$1\` line in ${roles}`],
    [/If the rule or (?:that|the) line is missing/g, 'If that line is missing'],
    [/,? or to the default if the rule or the line is missing/g, ', or to the default if the line is missing'],
    [/ Families go by prefix:.*?(?=\. [A-Z])\./g, ` Families are Claude (\`opus\`, \`sonnet\`, \`haiku\`) and Codex (\`codex\`), per ${roles}.`],
    [/ A refused `composer-\*` entry runs on `grok-4\.7-xhigh-fast`\./g, ''],
    [/`claude-opus-5-5-xhigh`/g, '`opus`'],
    [/`grok-4\.7-xhigh-fast`/g, CROSS_FAMILY.has(skill) ? '`codex`' : '`sonnet`'],
    [/your configured ([a-z-]+(?:, [a-z-]+)?) model \(default `sonnet`\)/g, `the \`$1\` model in ${roles}`],
    [/Every spawn is a Task subagent/g, 'Every spawn is a subagent'],
    [/`subagent_type: generalPurpose`/g, '`subagent_type: general-purpose`'],
    [/`subagent_type`: `generalPurpose`/g, '`subagent_type`: `general-purpose`'],
    [/`generalPurpose`/g, '`general-purpose`'],
    [/ and `readonly: true`/g, ''],
    [/, agent mode \(`readonly: false`\)/g, ''],
    [/,? and readonly strips MCPs/g, ''],
    [/(One message, three|One) `Task` calls?/g, (m, a) => a === 'One' ? 'One subagent call' : 'One message, three subagent calls'],
    [/the `Task` response body/g, 'the subagent result'],
    [/a `Task` prompt naming its path/g, 'a subagent prompt naming its path'],
    [/the Task tool/g, 'the subagent tool'],
    [/Cursor's built-in `create-skill` skill/g, 'the **skill-creator** skill'],
    [/ \(Cursor's built-in for authoring SKILL\.md files\)/g, ''],
    [/Cursor's built-in `create-skill`/g, '**skill-creator**'],
    [/create-skill/g, 'skill-creator'],
    [/Cursor's `\/loop` command(?: \(a built-in, not a pstack skill\))?/g, `the harness's loop or wakeup (${harness})`],
    [/the active workspace's `agent-transcripts\/` directory \(the system prompt names (?:this|the) path\)/g, `this project's transcripts (${harness})`],
    [/the active workspace's `agent-transcripts\/` directory \(the system prompt names the path\. Do not glob across `~\/\.cursor\/projects\/\*\/`, that crosses workspace boundaries and reads private chats from unrelated projects\)/g,
      `this project's transcripts (${harness}). Never read another project's transcripts, that reads private chats from unrelated work`],
    [/the `agent-transcripts\/` directory the system prompt names/g, `this project's transcripts (${harness})`],
    [/(Do not|Don't) glob across `~\/\.cursor\/projects\/\*\/`/g, '$1 read other projects\' transcripts'],
    [/`~\/\.cursor\/plugins\/`/g, '`~/.codex/skills/`'],
    [/`?~\/\.cursor\/skills\//g, m => m.startsWith('`') ? '`~/.claude/skills/' : '~/.claude/skills/'],
    [/`?\.cursor\/skills\//g, m => m.startsWith('`') ? '`.claude/skills/' : '.claude/skills/'],
    [/the (?:matching |relevant )?control skill(?: \(Non-negotiables\))?/g, 'the **live-verification** skill'],
    [/\*\*poteto-mode\*\*/g, '**lmerynda-mode**'],
    [/via poteto-mode/g, 'via lmerynda-mode'],
    [/AskQuestion/g, 'AskUserQuestion'],
    [/Run \*\*Opening a PR\*\*/g, 'Run **Landing**'],
    [/in their own PR\./g, 'in their own commit.'],
    [/in its own PR\./g, 'in its own commit.'],
  ];
}

// Exact edits for lines the generic rules can't express: dropped skills (why, unslop), the PR flow, cloud agents.
const GIT_HISTORY = 'the history (`git log -S`, `git blame`, linked issues and plan docs)';
const FIXES = {
  'architect/SKILL.md': [['also run the **why** skill on the existing shape', `also read ${GIT_HISTORY} of the existing shape`]],
  'automate-me/SKILL.md': [
    ['via skill-creator + unslop,', 'via skill-creator,'],
    ['This skill orchestrates three others: an inline mining pass (see step 1), **skill-creator** (authoring), and the **unslop** skill (prose discipline).',
      'This skill orchestrates two others: an inline mining pass (see step 1) and **skill-creator** (authoring).'],
    ["Locate the active workspace's transcripts before fanning out. The system prompt names the workspace's `agent-transcripts/` directory. Use only that path. Don't read other projects' transcripts. That crosses workspace boundaries and reads private chats from unrelated projects.",
      "Locate the transcripts before fanning out, per `../lmerynda-mode/references/harness.md`. A personal mode skill covers every project, so mine Claude Code and Codex history across projects, but keep private content out of the skill text. `node tools/extract.js` in the lmerynda-skills repo pulls the human prompts from both into one TSV."],
    ["The user's rules are not the same as poteto-mode's.", "The user's rules are not the same as poteto's."],
    ['Apply the **unslop** skill and `skill-creator`\'s writing guidelines to every line.', "Apply `skill-creator`'s writing guidelines to every line."],
    ['Work in a worktree off main. Commit and open a PR. Don\'t push to main directly.', 'Work in the lmerynda-skills repo. Commit locally and push only when the user says push.'],
  ],
  'benchmark-checklist/SKILL.md': [['Keep a PR body to one primary number, per the **Opening a PR** playbook.', 'Keep a commit message or report to one primary number.']],
  'blast-radius/SKILL.md': [
    ["Companion to `how` and `why`. `how` tells you what the code does. `why` tells you why it's shaped that way.", "Companion to `how`, which tells you what the code does."],
    ['Use `why` step 2 to pull the PR and commits.', 'Pull the commits and any linked issue with `git log` and `gh`.'],
    ['Write it through `unslop`, cite real code,', 'Write it plainly, cite real code,'],
  ],
  'figure-it-out/SKILL.md': [['so the reviewer can read it in the PR.', 'so the reviewer can read it next to the commits.']],
  'recall/SKILL.md': [
    ['That second record is what the **why** skill searches, across source control, the issue tracker, chat and issue channels, long-form docs, and error tracking.',
      'That second record lives in source control, the issue tracker, plan docs, and whatever chat or error tracking the project has.'],
    ['Transcripts live at `~/.cursor/projects/<slug>/agent-transcripts/<uuid>/<uuid>.jsonl`, where `<slug>` is the workspace path with the leading slash dropped and each "/" turned into "-" (so `/Users/you/proj` becomes `Users-you-proj`). Every line is one chat message.',
      'Transcript locations for Claude Code and Codex are in `../lmerynda-mode/references/harness.md`. Every line is one event.'],
    ["Hand it to the **why** skill's source investigators, but steer their question from \"why was this built this way\" to \"what's the current state, what's been tried and didn't hold, and what are users still reporting\". Reuse its per-source playbooks, run the investigators in parallel with the chat-history mining, and inherit its posture: one investigator per source, null results are findings, skip an unavailable MCP and say so.",
      "Spawn one investigator per source (`git log` and reverts, `gh` issues, plan docs, any connected tracker), asking \"what's the current state, what's been tried and didn't hold, and what are users still reporting\". Run them in parallel with the chat-history mining. Null results are findings. Skip an unavailable source and say so."],
    ['Write the brief through the **unslop** skill, cite chat findings', 'Write the brief plainly, cite chat findings'],
  ],
  'reflect/SKILL.md': [
    ['name a role line in the `pstack-models.mdc` rule and a default.', 'name a role line in `../lmerynda-mode/references/model-roles.md` and a default.'],
    ['Never edit a skill under `plugins/cache/`. Before approval, show its destination, `.claude/skills/<skill>/` or `~/.claude/skills/<skill>/`. After approval, copy the skill folder there and edit the copy. Never open a PR or push.',
      'Never edit the installed copies under `~/.claude/skills/` or `~/.codex/skills/`. Edit the skill in the lmerynda-skills repo (or the project repo for a project skill), then reinstall with `install.sh`. Never push.'],
  ],
  'show-me-your-work/SKILL.md': [[' (the **unslop** skill applies to log text too)', '']],
  'swarm/SKILL.md': [
    ['`environment: "cloud"`, `run_in_background: true`, and the step 3 model, left unset for `auto` or `inherit-parent`. Use `environment: "local"` only when the worker needs access to something on the user\'s computer.',
      '`run_in_background: true`, and the step 3 model, left unset for `auto` or `inherit-parent`. Workers that write get their own git worktree.'],
    ['When a worker must start from a non-default pushed branch, pass `cloud_base_branch`.', 'When a worker must start from another branch, create its worktree from that branch.'],
  ],
  'lmerynda-mode/playbooks/bug-fix.md': [['and the **why** skill for regression history', `and ${GIT_HISTORY} for regression history`]],
  'lmerynda-mode/playbooks/investigation.md': [
    ['For motivation questions, also route through the **why** skill.', `For motivation questions, also read ${GIT_HISTORY}.`],
    ['4. Apply the **unslop** skill to the reply.', '4. Write the reply per the mode\'s reply rules.'],
    ['No PR, no babysit, no `architect`', 'No commit, no `architect`'],
  ],
  'lmerynda-mode/playbooks/pause-safely.md': [['No PR and no push unless you already had one out.', 'No push.']],
  'lmerynda-mode/playbooks/perf-issue.md': [['5. Cite the measurement in the PR.', '5. Cite the measurement in the commit message.']],
  'lmerynda-mode/playbooks/hillclimb.md': [['Run **Landing** with the accepted commits stacked in the order they landed.', 'Run **Landing** with the accepted commits in the order they landed.']],
};

const leftovers = [];
function port(file, dest, skill, inPlaybook) {
  let t = fs.readFileSync(file, 'utf8');
  if (/\.(md|tsv|sh|txt)$/.test(file)) for (const [re, to] of rules(skill, inPlaybook)) t = t.replace(re, to);
  for (const [from, to] of FIXES[path.relative(path.join(repo, 'skills'), dest).replace(/\\/g, '/')] || []) {
    if (!t.includes(from)) throw new Error(`fix not found in ${dest}: ${from.slice(0, 80)}`);
    t = t.replace(from, to);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, t);
  t.split('\n').forEach((l, i) => {
    if (/cursor|composer|grok|poteto|pstack-models|unslop|\*\*why\*\*|`why`|Opening a PR|technical-writing|environment: "|babysit|\bPR\b/i.test(l))
      leftovers.push(`${path.relative(repo, dest)}:${i + 1}: ${l.slice(0, 160)}`);
  });
}

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
}

for (const s of SKILLS) {
  const out = path.join(repo, 'skills', s);
  fs.rmSync(out, { recursive: true, force: true });
  for (const f of walk(path.join(src, s))) port(f, path.join(out, path.relative(path.join(src, s), f)), s, false);
  const skillMd = fs.readFileSync(path.join(out, 'SKILL.md'), 'utf8');
  if (/^disable-model-invocation: true/m.test(skillMd)) {
    fs.mkdirSync(path.join(out, 'agents'), { recursive: true });
    fs.writeFileSync(path.join(out, 'agents', 'openai.yaml'), 'policy:\n  allow_implicit_invocation: false\n');
  }
}
for (const p of PLAYBOOKS) port(path.join(src, 'poteto-mode', 'playbooks', p + '.md'), path.join(repo, 'skills', 'lmerynda-mode', 'playbooks', p + '.md'), 'lmerynda-mode', true);

console.log(SKILLS.length, 'skills,', PLAYBOOKS.length, 'playbooks');
console.log(leftovers.join('\n'));
