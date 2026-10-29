---
name: git-discipline
description: "Commit, merge and push rules for lmerynda's repos. Use whenever you are about to commit, stage, merge a worktree, delete a branch, or push, and when finishing any task that changed files."
---

# Git discipline

## Commit

- A feature is finished when it works live and its targeted tests pass. Commit it then, before starting the next one: code, tests and README or docs in the same commit.
- When the live surface is unavailable (the app or game is closed, the user is away, the device is busy), commit once the code and targeted tests are done. Write `not verified live` in the commit body and the report, and run the live check when the surface is back. Never let finished features pile up uncommitted waiting for it.
- Planning, audit, proposal and docs-only work gets committed too.
- Stage only the files this task produced, by path. Never `git add -A` in a tree other sessions share.
- Never commit credentials, private transcripts, caches, generated images, art iterations, training data or large artifacts. Commit the spec, findings or minimal fixture derived from them. Images go to the scratchpad or an ignored `target/` folder.
- Always make a new commit. Never `--amend`, rebase published history or squash unless the user says so for that case.
- No attribution lines in messages. Commit identity follows the project's AGENTS.md.
- When the working tree holds other changes, check the commit's tree on its own: export it with `git checkout-index -a --prefix=C:/t/x/` (keep the path short). To stage partial content under `autocrlf=input`, use `git hash-object -w --path <file>` with `git update-index` so line endings still convert.

## Worktrees

- One worktree per parallel stream or writing subagent. Never two writers in one checkout.
- When a stream lands: close every process bound to its worktree (Unity or other Editors, dev servers, game builds), merge its branch into main, remove the worktree, delete the branch. An Editor left open on a worktree holds its files and steals the foreground from sessions that drive the desktop. The end state the user wants is main only with a clean tree.
- On Windows, delete any `node_modules` junction inside the worktree first (`cmd //c rmdir <path>\node_modules`, then confirm it is gone). `git worktree remove --force` follows junctions and empties the target.
- For a full cleanup, follow the Worktree cleanup playbook in **lmerynda-mode**.

## Push

Local commits and pushes are separate actions.

- Push only when the user says push in this conversation, for the repos, branches and work that request names.
- The approval ends when that push is done. It never carries to later changes, follow-up tasks, other repos or the next session.
- A request to implement, continue or commit is not push permission. Neither is a configured remote, passing checks, an earlier push, or the push seeming to complete the workflow.
- Approving an action that mentions pushing ("rewrite them before pushing") is not approval to push. The user must say push.
- "Implement X and push it" authorizes pushing X after it is validated, and nothing else.
- Local main may be far ahead of origin on purpose. A push publishes every earlier unpushed commit too, so say how many commits it would publish.

## Report

End every report that changed files with the commits made (short SHA and subject) and a plain statement that nothing was pushed, or exactly what was pushed with approval.
