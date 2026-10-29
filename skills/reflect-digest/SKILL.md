---
name: reflect-digest
description: "Weekly review of the reflect sweep's proposals: list each open reflect/* branch in lmerynda-skills with why, evidence and diffstat, then merge, drop or keep them as the user says. Use for /reflect-digest, a scheduled run marked [lmerynda-digest], or a reply like 'merge 1, 3, drop 2' to a digest."
disable-model-invocation: true
---

# Reflect digest

Paths are the same as the **reflect-sweep** skill: `REPO`, `WT`, `DATA`.

## 1. Build the digest

1. Open branches: `git -C REPO branch --list 'reflect/*' --no-merged main`.
2. For each branch: the subject and body (`git -C REPO log main..<branch> --format=%s%n%b`), the diffstat (`git -C REPO diff --stat main...<branch>`), distinct sessions and projects for it in `DATA/evidence.tsv`, and the date it was first seen.
3. Rank by distinct sessions, most first. Number them 1 to N. The numbers stay fixed for this digest.
4. Project lessons from `DATA/project-lessons.tsv` since the last digest (`DATA/digest-state.json`), grouped by project.
5. Sweep health from `DATA/runs/*/summary.md` since the last digest: nights run, prompts mined, failures.
6. Write the digest to `DATA/digests/<date>.md` and record the numbering there, then update `digest-state.json`.

## 2. Reply with the digest

Written to be read on a phone. For each branch, one block:

- **N. Subject.** Why, in one sentence from Problem. What changes, in one sentence from Proposal. Evidence: sessions and projects. Diffstat in one line.

Then project lessons, one line each, and one line of sweep health. End by asking the user to reply in their own words, for example "merge 1 and 3, drop 2". Unmentioned branches carry over to the next digest. Nothing is deleted without the user's word.

## 3. Apply the user's reply

The user's reply in this session is the approval. It covers only the branches it names.

1. `REPO` must be on `main` with a clean tree. If it is not, stop and say what is in the way; don't stash or move the user's work.
2. Merge each approved branch: `git -C REPO merge --no-ff reflect/<...>`. Resolve conflicts between approved branches yourself, keeping both intents. Then `node REPO/tools/check-skills.js` must pass.
3. Run `REPO/install.sh` so the merged changes are live for Claude Code and Codex.
4. Delete merged branches with `git -C REPO branch -d`. For each dropped branch, append a `rejected.tsv` row (date, branch, its Problem line), then `git -C REPO branch -D` it.
5. A change the user asks for on a branch ("merge 1 but shorter") gets made in `WT` on that branch, committed, then merged.

**Reply:** what merged (commits), what was dropped, what carries over, that skills were reinstalled, and that nothing was pushed.
