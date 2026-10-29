### Worktree cleanup

**You own a main-only, clean end state without losing work.** For "clean up worktrees", "what's using my disk", or the end of a multi-stream run.

1. List worktrees from git, never by hand: `git worktree list --porcelain`. For each, record its branch, whether the branch is merged into main (`git branch --merged main`), its uncommitted files (`git -C <path> status --porcelain`), its size, and its last commit date.
2. Check that no running session owns it. A worktree a live session or background agent works in is in use even when merged. Ask only when you cannot tell.
3. Pause on loss. Uncommitted tracked edits mean show the diff and get a decision. An unmerged branch with commits not on main means name the commits and get a decision. Untracked throwaway files are safe to drop, but name them.
4. Close the processes bound to each confirmed worktree (Editors, dev servers, builds run from it) and confirm they exited. Then remove junctions. On Windows, `git worktree remove --force` follows a `node_modules` junction and empties the target. Delete each junction itself (`cmd //c rmdir <path>\node_modules`), confirm it is gone, then remove the worktree.
5. Prune the confirmed set: `git worktree remove --force <path>`, `git branch -d <branch>` for merged branches, then `git worktree prune`. Re-list to confirm.

**Reply:** the worktrees removed, the branches deleted, and a one-line reason for each one held back.
