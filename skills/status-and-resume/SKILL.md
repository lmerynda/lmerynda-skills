---
name: status-and-resume
description: "Answer 'where are we?', 'status?', 'what's left?' and resume interrupted work in lmerynda's projects without redoing it. Use when the user asks for status, comes back after a break, when resuming a thread, session or worktree, and during long runs to send unprompted updates."
---

# Status and resume

The user comes back often and asks where things stand. Make that cheap.

## Answering "where are we?"

Read the state before answering: `git status`, `git log --oneline` since the work started, `git worktree list`, running processes and background agents, the plan doc or todo, and the decision log if one exists. Then answer in this shape, short:

- **Done.** What landed, with commits.
- **In progress.** What is running now and who runs it (session, worktree, background agent).
- **Left.** What remains, in order.
- **Blocked.** What waits on the user, as decisions with your recommended answer.
- **State.** Commit and push state: what is committed, what is uncommitted, and that nothing was pushed.

Group by stream when several run at once. For a catch-up over a whole chat, use the **ketchup** skill. To rebuild context across several recent chats, use the **recall** skill.

## Keeping it cheap during long runs

- On a long or multi-stream run, keep a decision log via the **show-me-your-work** skill (what, why, evidence, result), outside the repo unless a reviewer needs it.
- Write a short status at the end of each meaningful step, in the same shape as above.
- Send updates during long runs without waiting to be asked.

## Resuming

- Read the trail first: the thread, `git log`, the worktrees and their branches, plan docs, the decision log. The trail is authoritative. Don't re-derive it or redo finished work.
- Report the resume point (what the prior run finished, what you take over) before continuing.
- A specific prior session to take over follows the Session pickup playbook in **lmerynda-mode**. Stopping cleanly for a later resume follows Pause safely.
