// Validate every skill: frontmatter, referenced files, and **skill** cross-links.
// usage: node tools/check-skills.js   (exit 1 on any problem)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), skillsDir = path.join(root, 'skills');
const skills = fs.readdirSync(skillsDir).filter(d => fs.existsSync(path.join(skillsDir, d, 'SKILL.md')));
// Skills this repo routes to but does not ship: Pocock's grilling set and the harness's own skill-creator.
const EXTERNAL = new Set(['grilling', 'grill-me', 'grill-with-docs', 'domain-modeling', 'skill-creator']);
const problems = [];

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
}

for (const s of skills) {
  const dir = path.join(skillsDir, s), md = fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8');
  const fm = md.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { problems.push(`${s}: no frontmatter`); continue; }
  if ((fm[1].match(/^name: (.+)$/m) || [])[1] !== s) problems.push(`${s}: name does not match folder`);
  if (!/^description: \S/m.test(fm[1])) problems.push(`${s}: no description`);
  const userOnly = /^disable-model-invocation: true$/m.test(fm[1]);
  const yaml = path.join(dir, 'agents', 'openai.yaml');
  if (userOnly && !(fs.existsSync(yaml) && /allow_implicit_invocation: false/.test(fs.readFileSync(yaml, 'utf8'))))
    problems.push(`${s}: user-only but agents/openai.yaml does not block implicit invocation`);

  for (const f of walk(dir).filter(f => f.endsWith('.md'))) {
    const t = fs.readFileSync(f, 'utf8'), rel = path.relative(root, f);
    const base = f.includes(`${path.sep}playbooks${path.sep}`) ? dir : path.dirname(f);
    for (const [, ref] of t.matchAll(/`((?:\.\.\/)?(?:[\w-]+\/)*(?:references|playbooks|scripts|features)\/[\w./-]+\.(?:md|tsv|sh|mjs|ts))`/g)) {
      if (/[<>]/.test(ref)) continue;
      const candidates = [path.resolve(base, ref), path.resolve(dir, ref)];
      if (!candidates.some(fs.existsSync)) problems.push(`${rel}: missing file ${ref}`);
    }
    for (const [, name] of t.matchAll(/\*\*([a-z][a-z0-9-]+)\*\* (?:principle )?skill/g)) {
      const target = name.startsWith('principle-') || skills.includes(name) ? name : `principle-${name}`;
      if (!skills.includes(name) && !skills.includes(target) && !EXTERNAL.has(name)) problems.push(`${rel}: unknown skill ${name}`);
    }
    for (const [, pb] of t.matchAll(/`playbooks\/([\w-]+)\.md`/g))
      if (!fs.existsSync(path.join(skillsDir, 'lmerynda-mode', 'playbooks', pb + '.md'))) problems.push(`${rel}: missing playbook ${pb}`);
  }
}

console.log(problems.length ? problems.join('\n') : `ok: ${skills.length} skills`);
process.exit(problems.length ? 1 : 0);
