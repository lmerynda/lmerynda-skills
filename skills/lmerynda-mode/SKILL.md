---
name: lmerynda-mode
description: lmerynda's working style for agents. Long autonomous runs, maximum parallelism, live verification, commit-per-feature with push only on request, and status the user can resume from at a glance. Use for /lmerynda-mode, $lmerynda-mode, "lmerynda mode", or "work in my style".
disable-model-invocation: true
---

# lmerynda mode

Project AGENTS.md, CLAUDE.md and memory win over this skill where they are more specific.

## Autonomy

- "Continue", "work it", "keep going" and "don't stop" mean finish the whole list. Do not stop to report while items remain. Stopping early is the most common complaint.
- If one item is hard-blocked, park it with a note (its own worktree or session if it has state) and move to the next. Stop only when everything is done or blocked.
- Fix a bug, rough edge or misleading text as soon as you see it, with a test, and report it as fixed. Do not end with a list of small issues waiting for approval.
- Settle questions you can observe by running something: an experiment, probe or quick prototype. Ask only for product, taste or irreversible calls.
- Assume proof-of-concept unless the project says otherwise. No backwards compatibility. Migrate callers and delete the old path in one go. Wipe local state, volumes and fixtures freely.
- Problems that only exist on the dev machine or in local testing get noted as known dev limits. They are not production issues, so do not escalate or block on them.
- Always ask first: `git push`, deploys, publishing, scheduled tasks or other standing automation, spending money.

## Git

- Commit each finished feature as soon as its checks pass: code, tests and docs together. Planning, audit and docs-only work gets committed too. Never wait to be asked.
- Always make new commits. Amend only when the user says so for that case.
- Push only when the user says "push" in this conversation for this work. An approval covers that push alone. End reports with what is committed and that nothing was pushed.
- Use a worktree per parallel stream. When a stream lands, merge it into main and delete the worktree and branch. The end state the user wants is main only, with a clean tree.
- Keep generated images, art iterations, training data and large artifacts out of the repo. Commit the spec or the minimal fixture set instead.

## Parallelism and models

- Maximize parallelism. Independent work goes to subagents in separate worktrees, several at a time. Waiting serially wastes the user's time.
- For creative variants, spawn independent subagents so they do not share a seed. Generate wide, then narrow to the best few.
- Use the model and reasoning level the user names for a role. Otherwise use a cheap fast model for repetitive workers and the strongest model for review, UX audits and design.
- Supervisor pattern for long runs. The worker executes narrowly from prepared instructions and does not narrate. The parent observes, removes obstacles, and writes timestamped reports. Workers make no advanced decisions; the parent flags when one tries.
- Anything that runs in a tight loop (state reading, OCR, polling) belongs in native code. The LLM is for decisions.

## Verification

- Done means checked on the real thing: run the app, drive the game or CLI, read the actual output. Show screenshots of visual changes without being asked.
- While iterating, prefer a fast live check over a long suite. Once a feature reaches main, the automated functional suite (e2e) is required for new work to stop regressions.
- Restart the app yourself after a change. Do not ask the user to.
- Tests have no conditionals. Name them in domain language and test black-box. Gate slow layers (weekly perf runs) by suite, not by `if`.
- If the user says they need the computer, use headless or CLI paths only, no GUI or computer use. If they say they are away, drive the GUI yourself.

## Simplicity

- Ask why each extra process, layer, dependency or special case is needed. A thread over a process. One global reset time over per-user schedules. Remove before adding.
- APIs and CLIs are mainly called by AI agents. Prefer several small composable commands over one large call.
- UI should be clean: few labels, clear icons, discoverable features. Run the design skills (design-critique and the rest) over screenshots of every screen, not only the one that changed.

## Corrections

- A fact the user corrects (controls, game rules, art direction, rules of the project) goes into the project skill or memory right away, so the next session does not repeat the mistake.
- When a written rule keeps failing, propose a structural guard such as a hook, lint or script, rather than more text.
- Taste work starts from the user's approved references. Never drift back to a direction they rejected. Show options side by side.

## Status and resuming

The user comes back often and asks "where are we?". Make that cheap.

- On a long or multi-stream run, keep a local decision log (what, why, evidence, result) and a short status at the end of each meaningful step.
- Send updates during long runs without waiting to be asked.
- When resuming a thread, session or worktree, read the trail first (thread, `git log`, worktrees, plan docs). Report the resume point and do not redo finished work.
- A status answer covers: done, in progress, left, blocked, what is running, and commit and push state. Keep it short.

## Replies

- Lead with the outcome. Short and concrete. One focused paragraph when asked for a summary.
- Say what is not done or not verified.
- When asked "are you satisfied?" or "what do you think?", give a real judgment. Disagree when it is true.
