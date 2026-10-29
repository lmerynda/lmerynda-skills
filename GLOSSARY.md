# Glossary

- **Steering file.** `core/steering.md`. The always-on rules, installed as a marked block in `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`. Short on purpose; details live in skills.
- **Router.** The `lmerynda-mode` skill. Invoked by hand for heavy runs; maps the task to a playbook and names the skills to load.
- **Playbook.** A step list under `skills/lmerynda-mode/playbooks/`, copied into the todo list verbatim when it matches.
- **Granular skill.** A skill the agent loads by itself when its description matches (git-discipline, live-verification, status-and-resume, supervisor-worker, the `principle-*` skills).
- **Principle skill.** A `principle-*` skill from pstack. One rule, when it applies, and how.
- **Role line.** A row in `skills/lmerynda-mode/references/model-roles.md` naming which model a pstack role uses.
- **Sweep.** The nightly `reflect-sweep` run over conversations idle for 2 hours or more.
- **Reflect branch.** A local `reflect/<date>-<slug>` branch holding one proposed improvement. Never pushed by the sweep.
- **Evidence.** The distinct conversations that support a reflect branch, logged in `~/.lmerynda-skills/evidence.tsv`, outside the repo.
- **Digest.** The weekly `reflect-digest` run that lists open reflect branches for review and merges or drops them on the user's reply.
- **Project lesson.** A finding about one project rather than about how agents work. Reported in the digest, never edited into a project automatically.
