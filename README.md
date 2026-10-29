# lmerynda-skills

How I work with Claude Code and Codex, as an always-on steering file, a router skill, granular skills, and a feedback loop that keeps improving them.

## Layers

| layer | what | loaded |
|---|---|---|
| Steering | `core/steering.md`: autonomy, git, verification, design, Windows gotchas | every session, via `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md` |
| Router | `lmerynda-mode`: maps a task to a playbook and the skills it needs | by hand: `/lmerynda-mode`, `$lmerynda-mode` in Codex |
| Granular skills | `git-discipline`, `live-verification`, `status-and-resume`, `supervisor-worker`, 24 `principle-*` skills | by the agent, when a description matches |
| Workflow skills | `how`, `architect`, `arena`, `swarm`, `interrogate`, `blast-radius`, `figure-it-out`, `recall`, `ketchup`, `show-me-your-work`, `correct`, `reflect`, `automate-me`, and more | by hand or routed from a playbook |
| Feedback loop | `reflect-sweep` nightly, `reflect-digest` weekly | scheduled tasks in the Claude desktop app |

Terms are defined in [GLOSSARY.md](GLOSSARY.md).

## Feedback loop

1. Every night at 03:00, `reflect-sweep` mines the Claude Code and Codex conversations that have been idle for 2 hours or more (`tools/extract.js`), looking for repeated corrections and friction.
2. A finding becomes a change only when 2 or more conversations show it, or 1 when an agent broke a hard rule (an unrequested push, for example). Each change lands on its own local `reflect/<date>-<slug>` branch, at most 3 a night, made in a separate worktree (`F:\projects\lmerynda-skills-reflect`). A finding that matches an open branch adds evidence to it instead.
3. Every Sunday at 09:00, `reflect-digest` lists the open branches with why, evidence and diffstat. Reply "merge 1, 3, drop 2" and it merges, reinstalls and cleans up.

Branches stay local. The evidence log lives in `~/.lmerynda-skills/`, outside the repo, so pushing a branch publishes the rule and never the conversation behind it.

## Install

```sh
git clone https://github.com/lmerynda/lmerynda-skills.git
cd lmerynda-skills
./install.sh
```

This writes the steering block into `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md` (other content in those files is kept), copies every skill into `~/.claude/skills/` and `~/.codex/skills/`, and installs the `lmerynda-agent` delegate into `~/.claude/agents/`. Start a new session afterwards.

The idea-stage grilling uses [Matt Pocock's skills](https://github.com/mattpocock/skills): install `grill-me`, `grill-with-docs`, `grilling` and `domain-modeling` alongside.

## Tools

- `tools/extract.js`: typed prompts from Claude Code and Codex transcripts, with the agent text each one answered.
- `tools/check-skills.js`: validates frontmatter, file references and skill cross-links. Run before every commit.
- `tools/port-pstack.js`: re-ports pstack from upstream.

## Credit

Most skills are adapted from [poteto's pstack](https://github.com/cursor/plugins/tree/main/pstack) (MIT). See [NOTICE.md](NOTICE.md) for what was ported and how. The idea stage leans on [Matt Pocock's](https://github.com/mattpocock/skills) `grilling` and `domain-modeling`.

## License

MIT. Ported pstack content stays under its own MIT license in `LICENSE-pstack`.
