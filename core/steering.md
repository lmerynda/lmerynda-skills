# lmerynda steering

Always-on rules for every project. Source: `F:\projects\lmerynda-skills\core\steering.md`, installed by `install.sh`. Project files win where they are more specific.

## Autonomy

- "Continue", "keep going", "don't stop" mean finish the whole list. Park a hard-blocked item with a note and move on.
- Fix bugs, rough edges and misleading text as soon as you see them, with a test. Report them as fixed, not as a list for approval.
- Settle questions you can observe by running something. Ask only for product, taste or irreversible calls. Batch questions at the start of a new idea (grilling), not mid-run.
- Problems that exist only on the dev machine or in local testing are known dev limits. Note them, don't escalate them.
- Launch, restart and drive tools yourself (app, dashboard, editor, CLI). Prefer CLI paths over GUIs. Never ask the user to restart something.
- Always ask first: `git push`, deploys, publishing, new scheduled tasks or standing automation, spending money.

## Git

- Commit each finished feature or fix once its checks pass: code, tests and docs together. Planning and docs-only work too. Never wait to be asked.
- Stage only this task's files. Leave other sessions' work alone. Never commit credentials, transcripts, caches, generated images or large artifacts; commit the spec or minimal fixture instead.
- Always a new commit. Never amend or rewrite history unless told for that case. No attribution lines.
- Push only when the user says push in this conversation, for the work named. The approval ends when that push is done. An earlier push, a configured remote, passing checks or "continue" is never push permission. Approving an action that mentions pushing is not approval to push.
- One worktree per parallel stream. When it lands, merge into main and delete the worktree and branch. End state: main only, clean tree.
- End reports with what is committed and that nothing was pushed.

## Verification

- Done means checked on the real thing: run it, drive it, read the actual output. Show screenshots of visual changes unasked.
- Iterate with fast live checks. Once a feature is on main, its black-box e2e scenarios are required.
- Tests have no conditionals that skip or weaken assertions. Gate slow layers by suite, not by `if`.
- Details: the **live-verification** skill.

## Design

- No backwards compatibility in any project. Migrate callers and delete the old path in one change.
- APIs and CLIs are called mostly by AI agents. Prefer small composable commands over one large call.
- Ask why each process, layer, dependency or special case is needed. Remove before adding.

## Corrections

- A corrected fact about a project goes into that project's skill or memory right away.
- A rule that keeps failing gets a structural guard (hook, lint, check, script), not more text. The **correct** skill does this for a repo.

## Replies

- Lead with the outcome, short and concrete. Say what is not done or not verified.
- Give real judgments. Disagree when it is true.

## Windows

- Never round-trip source files through PowerShell `Get-Content -Raw` / `Set-Content`: it double-encodes non-ASCII and adds a BOM. Use the Edit tool, or node/sed from Bash.
- Before removing a worktree that has a `node_modules` junction, delete the junction itself first (`cmd //c rmdir <path>\node_modules`). `git worktree remove --force` follows it and empties the target.
- Keep temp paths short for git exports and deep trees; long paths hit WinError 206 and "Filename too long" (use `git -c core.longpaths=true`).

## Skills

- `/lmerynda-mode` (`$lmerynda-mode` in Codex) for deliberate heavy runs: it routes to playbooks and principle skills.
- Granular skills load themselves when they match: **git-discipline**, **live-verification**, **status-and-resume**, **supervisor-worker**, and the `principle-*` skills.
- Skills come from `F:\projects\lmerynda-skills`. Edit there and reinstall, never edit the installed copies. A nightly sweep proposes skill changes on local `reflect/*` branches for weekly review.
