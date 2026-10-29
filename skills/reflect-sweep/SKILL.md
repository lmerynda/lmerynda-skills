---
name: reflect-sweep
description: "Nightly feedback sweep: mine finished Claude Code and Codex conversations for repeated corrections and friction, and land each proven improvement on its own local reflect/* branch in lmerynda-skills for weekly review. Use for /reflect-sweep or a scheduled run marked [lmerynda-sweep]."
disable-model-invocation: true
---

# Reflect sweep

Runs unattended. Never ask the user anything, never push, never touch the main checkout's working tree.

## Paths

- `REPO`: `F:\projects\lmerynda-skills`, the main checkout. Read-only here.
- `WT`: `F:\projects\lmerynda-skills-reflect`, the sweep's own worktree. All edits happen here.
- `DATA`: `~/.lmerynda-skills/`. Local only, never committed:
  - `sweep-state.json`: per-session marks of what was already mined.
  - `runs/<date>/`: the night's batch and findings.
  - `evidence.tsv`: `ts`, `branch`, `session`, `project`, `tool`, `note`. One row per conversation supporting a branch.
  - `project-lessons.tsv`: `ts`, `project`, `lesson`, `sessions`.
  - `rejected.tsv`: `ts`, `branch`, `problem`. Findings the user dropped in a review.

## 1. Prepare

1. Create `WT` if missing: `git -C REPO worktree add --detach WT main`. Otherwise `git -C WT switch --detach main` and confirm `git -C WT status --porcelain` is empty. If it is not empty, a previous run died mid-edit: `git -C WT reset --hard` and `git -C WT clean -fd`.
2. Extract the batch: `node REPO/tools/extract.js --out DATA/runs/<date>/batch.jsonl --idle-hours 2 --state DATA/sweep-state.json`, adding `--since 7d` when `sweep-state.json` does not exist yet. Each row is one prompt the user typed, with `prev`, the agent text it answered.
3. Zero prompts: append a row to `DATA/runs/<date>/summary.md` saying so, promote the state (step 6.3) and stop.

## 2. Load what is already open or decided

- Open branches: `git -C REPO branch --list 'reflect/*' --no-merged main`. For each, read its commit body (`git -C REPO log -1 --format=%B <branch>`), which holds Problem and Proposal, and count its distinct sessions in `evidence.tsv`.
- Rejected findings from `rejected.tsv`.
- The current skill list (`ls REPO/skills`) and `REPO/core/steering.md`.

## 3. Mine

Split the batch into slices of about 150 prompts. For each slice, spawn two reviewers in parallel, both reading the slice file:

| Lens | Role line in `../lmerynda-mode/references/model-roles.md` | Template |
|---|---|---|
| Judgment | `reflect judgment, divergent, synthesizer` | `../reflect/references/judgment-reviewer.md` |
| Tooling | `reflect tooling` | `../reflect/references/tooling-reviewer.md` |

Prepend this to each template, and pass the slice path where the template asks for a transcript:

> The input is a JSONL batch, not one transcript. Each row is a prompt the user typed (`text`) with the agent message it answered (`prev`), its `session`, `project` and `tool`. The signal is corrections, frustration, re-asks, the same instruction given again, and the user doing by hand what an agent should have done. Ignore the template's "Scope to skills and tools the session actually used" section. Instead, route each finding to the lmerynda-skills skill or steering section whose domain covers it, from this list: `<skill list>`, `core/steering.md`. Say whether the finding is global (about how agents should work anywhere) or about one project. Cite every finding by session ids, never by quoting the user's words.

## 4. Synthesize

One synthesizer subagent on the `reflect judgment, divergent, synthesizer` role, with `../reflect/references/synthesizer.md` and every reviewer's output inlined, plus the open branches, rejected findings and these overrides:

> Replace the Skill-was-used criterion with these rules.
> - Evidence: accept a global finding only when 2 or more distinct sessions show it. One session is enough when an agent broke a hard rule: pushed, deployed or published without being asked, amended or rewrote history, committed secrets, or deleted data outside git.
> - Dedupe: a finding that matches an open branch is not new. List it as `add evidence: <branch>` with its sessions.
> - Rejected: a finding matching a rejected one is dropped unless 3 or more new sessions show it. Then accept it and say it was dropped before.
> - Project findings go to a Project lessons list (project, lesson, sessions), not to skill edits.
> - Prefer a structural fix (a check in `tools/`, a script, a stronger rule placement) over more prose, per the encode-lessons principle.
> - Output at most 3 Accepted rows, ranked by distinct sessions, each with a kebab-case slug.

## 5. Land each accepted row on its own branch

For each Accepted row, in rank order:

1. `git -C WT switch -c reflect/<date>-<slug> main`.
2. Make the smallest edit that implements the Proposal, inside `WT` only: a skill body, a description, `core/steering.md`, or a check in `tools/`. Follow the Authoring a skill playbook. No transcript quotes, names of private people, or project secrets in the text: the repo is public.
3. `node WT/tools/check-skills.js` must pass. If it fails and the fix isn't obvious, drop the branch (`git -C WT switch --detach main`, `git -C WT branch -D <branch>`) and record why in the summary.
4. Commit with subject `reflect: <one line>` and a body of `Problem: ...`, `Proposal: ...`, `Evidence: <N> sessions in <projects>`. No attribution lines.
5. Append one `evidence.tsv` row per supporting session.

Then for each `add evidence` row, append its sessions to `evidence.tsv` under that branch. For each project lesson, append to `project-lessons.tsv`.

## 6. Finish

1. `git -C WT switch --detach main`. The worktree ends clean.
2. Write `DATA/runs/<date>/summary.md`: prompts and sessions mined, new branches, evidence added to which branches, project lessons, dropped findings with reasons, failures.
3. Promote the state only now: copy `batch.jsonl.next-state.json` over `DATA/sweep-state.json`. A run that died earlier is retried next night.

**Reply:** the summary, in a few lines. Never push. Never merge into main.
