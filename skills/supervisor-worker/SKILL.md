---
name: supervisor-worker
description: "Shape of lmerynda's long and parallel runs: a coordinator that dispatches independent work to worktree sessions or subagents, each running its own design-review-work-verify loop, while the coordinator observes, merges and brings only decisions to the user. Use for multi-stream work, queues of plans, long unattended runs, and any task with independent pieces."
---

# Supervisor and worker

## Shape

- **Maximize parallelism.** Independent work goes to subagents or sessions in separate worktrees, several at a time. Waiting serially wastes the user's time.
- **Coordinator.** One session triages the queue (done, blocked on a decision, ready), dispatches each ready independent item, merges landed work into local main, and sends the user only decisions that are theirs. It does not write the code itself.
- **Workers.** Each runs its own full loop: design (plan and plan review), work, test, review, then live verification where the change touches behavior or presentation, repeating until accepted. A brief that only says "implement X" is incomplete.
- **Long-run supervision.** For a long mechanical run, the worker executes narrowly from prepared instructions and does not narrate. The supervisor observes, removes obstacles, and writes timestamped reports. Workers make no advanced decisions. The supervisor flags when one tries.

## Briefs

Every brief names:

- the user's goal in your own words, and the plan file if there is one,
- the done criteria and the evidence that proves them (a command and its output, a screenshot, a live check),
- the loop above, and the project's AGENTS.md gates,
- the paths it may write and the actions it must not take (push, deploy, publish),
- its own worktree and branch,
- the model per `../lmerynda-mode/references/model-roles.md`, or the one the user named for the role.

## Supervising

- Read each worker's diff or artifact, not only its summary. Green tests are an input to a verdict, not the verdict.
- A worker that stalls or loops gets stopped and replaced by a fresh one with consolidated scope.
- Keep one owner for any exclusive resource across workers: the game, a Unity Editor, a device, a port.
- Merge landed streams into main, delete their worktrees and branches, push nothing.
- Keep a decision log via the **show-me-your-work** skill.

## Where the model belongs

- Anything that runs in a tight loop (reading state, OCR, polling, input) belongs in native code or a script. The model is for decisions.
- Creative variants go to independent subagents so they don't share a seed. Generate wide, then narrow to the best few (the **arena** skill).
- Parallel coverage, races and exploration go to the **swarm** skill.
