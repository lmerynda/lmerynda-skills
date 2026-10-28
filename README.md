# lmerynda-skills

Agent skills for how I work with Claude Code and Codex.

## Skills

| skill | use it when |
|---|---|
| `lmerynda-mode` | you want an agent to work in my style: long autonomous runs, lots of parallel subagents, live verification, a commit per feature with push only on request, and status you can resume from at a glance. |

`lmerynda-mode` was drafted by mining about 800 of my own prompts across Claude Code and Codex. Only patterns that showed up repeatedly made it in.

It only runs when invoked: `/lmerynda-mode` in Claude Code, `$lmerynda-mode` in Codex.

## Install

```sh
git clone https://github.com/lmerynda/lmerynda-skills.git
cd lmerynda-skills
./install.sh
```

This copies each skill into `~/.claude/skills/` and `~/.codex/skills/`. Start a new session afterwards so the skill gets picked up.

Or with the [skills CLI](https://skills.sh):

```sh
npx skills add lmerynda/lmerynda-skills --skill lmerynda-mode
```

## Credit

Inspired by [poteto's pstack](https://github.com/poteto/plugins/tree/main/pstack), especially `poteto-mode` and `automate-me`.

## License

MIT
