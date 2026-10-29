### Landing

**You own a clean main.** Replaces pstack's Opening a PR. The user's projects commit to main, with no PR flow.

1. Stage only the files this task produced (`git add <files>`, never `-A`). Leave other sessions' in-progress files alone. Keep credentials, transcripts, caches, generated images and large artifacts out.
2. Commit each finished feature or fix on its own, once its checks pass: code, tests and docs together. Always a new commit, never `--amend`. No attribution lines.
3. Work from a worktree branch lands by merging into main. Then remove the worktree and delete the branch (follow the **git-discipline** skill's junction rule on Windows). The end state is main only with a clean tree.
4. Do not push. Push only when the user says push in this conversation for this work.
5. Reinstall or restart what the change affects (skills via `install.sh`, the app, a dashboard) so the user never runs stale code.

**Reply:** what landed on main with its commits, what was merged and cleaned up, and that nothing was pushed.
