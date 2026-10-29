# Harness

Where the ported pstack skills meet Claude Code and Codex. pstack was written for Cursor; this file names the equivalents.

## Subagents

- Claude Code: the Agent tool (pstack's `Task`). `subagent_type: general-purpose`, or `lmerynda-agent` for delegates inside an lmerynda-mode playbook. Pass `model` per `model-roles.md` and `run_in_background: true`. Use `isolation: "worktree"` for a writer.
- Codex: its native subagent tool when the session has one. Otherwise run `codex exec -C <worktree> -s workspace-write -o <result file> "<brief>"` from the shell.
- Cross-family seat from Claude Code: `codex exec` as above. There is no `claude` CLI on PATH, so Codex cannot start Claude seats.

## Loops and waiting

- Claude Code: `/loop` for a self-paced loop, ScheduleWakeup for a delayed check, Monitor for waiting on a condition, background Bash for long commands (you are woken when it exits).
- Codex: keep the turn running and poll with the shell, or hand a recurring job to a desktop-app scheduled task.
- Recurring jobs that must survive the session: the Claude desktop app's scheduled tasks. The PC stays on, so timers are reliable.

## Transcripts

- Claude Code: `~/.claude/projects/<slug>/<session-id>.jsonl`, one event per line. `<slug>` is the working directory with `:`, `\` and `/` turned into `-` (`C:\Projects\bsgo` becomes `C--Projects-bsgo`). Worktree sessions get their own slug. Skip `subagents/` folders, `isMeta` and `isSidechain` lines.
- Codex: `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl` and compressed `~/.codex/archived_sessions/*.jsonl.zst` (Node 24+ reads them with `zlib.zstdDecompressSync`). The project is the `cwd` in `session_meta` or `turn_context`. Only the first user message of a turn whose `task_started` trigger is `composer` or `remote*` was typed by the user.
- `tools/extract.js` in the lmerynda-skills repo pulls the human prompts out of both.
- Read only the project the task is about, unless the task is about the user's working style across projects.

## Skills

- Installed copies: `~/.claude/skills/<name>/` and `~/.codex/skills/<name>/`. Both come from `F:\projects\lmerynda-skills` through `install.sh`. Edit the repo, never the installed copy.
- Project skills: `.claude/skills/<name>/` in the repo.
- Authoring: the **skill-creator** skill.
- A user-only skill has `disable-model-invocation: true` and, for Codex, `agents/openai.yaml` with `policy.allow_implicit_invocation: false`.

## Driving the real thing

pstack's "control skill" is the **live-verification** skill here. It names the browser pane, computer use, Playwright, Unity CLI and the project's own run scripts.

## Platform

Windows 11, Git Bash and Windows PowerShell 5.1. Gotchas live in the steering file's Windows section.
