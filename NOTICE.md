# Notice

Most skills in `skills/` are adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan (poteto), MIT licensed. See `LICENSE-pstack`.

Ported from pstack commit `1ba91fc` (pstack 0.15.36) by `tools/port-pstack.js`, which swaps Cursor specifics for Claude Code and Codex: models, subagents, transcript paths, loops and the PR flow. The ported skills are every `principle-*` skill plus architect, arena, automate-me, benchmark-checklist, blast-radius, bro, correct, create-verification-skill, figure-it-out, how, in-your-own-words, interrogate, ketchup, maintain-verification-skill, recall, reflect, sharpen, show-me-your-work, swarm and tdd, and the playbooks under `skills/lmerynda-mode/playbooks/` except `landing.md` and `worktree-cleanup.md`.

Written here: `core/steering.md`, `lmerynda-mode` (modeled on poteto-mode), git-discipline, live-verification, status-and-resume, supervisor-worker, reflect-sweep, reflect-digest, and `tools/`.

To re-sync with upstream, clone pstack and run `node tools/port-pstack.js <pstack>/skills .`, then review the diff. An exact fix that no longer matches upstream fails loudly.
