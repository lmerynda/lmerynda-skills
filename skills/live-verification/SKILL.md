---
name: live-verification
description: "How to prove a change works on the real thing in lmerynda's projects: drive the app, game, CLI or service yourself, screenshot visual changes, restart what you changed, and keep tests honest. Use before saying anything is done, when reproducing a bug, when writing or changing tests, and whenever a playbook says 'control skill' or 'matching surface'."
---

# Live verification

Done means checked on the real thing. A passing unit test, a clean compile or a subagent's summary is not proof.

## Drive the surface yourself

- **Web UI:** the Claude browser pane (`preview_start`, then read the page or screenshot it), or Playwright from a script for repeatable checks.
- **Desktop app or game:** computer use, or the project's own driver scripts. Read state from the screen or from the game's own data, then act and read again.
- **Unity:** the `unity` CLI. Open with `unity open <path>`, wait for `unity status`, run tests with `unity command --project-path <path> run_tests`, read the console with `get_console_logs`. Close the Editors you opened.
- **CLI or service:** run the real binary against real or stub services that speak the real protocol, and read the actual output.
- The project's own verify skill wins when it has one (`.claude/skills/verify-*`). The **create-verification-skill** skill builds one when it doesn't.

## While iterating

- Prefer a fast live check over the full suite: run only the targeted test files, restart, then check live.
- Restart the app, dashboard or service yourself after every change. Never ask the user to, and never leave them running stale code. If a restart script refuses because something holds the process, force it and say what the kill may have left behind.
- Show screenshots of visual changes without being asked. Keep screenshots out of the repo.
- When the user says they need the computer, use headless and CLI paths only. When they say they are away, drive the GUI.
- Run live checks from a separate worktree when other sessions work in the main checkout.

## Tests

- Once a feature is on main, its user-visible flows need black-box e2e scenarios, written with the feature in the same change. The full suite must pass.
- E2E style: tests named as product sentences, short given/when/then step functions, the real binary per actor with isolated state, stub external services on their real protocol and controllable from the test, waits on the product's own events instead of sleeps.
- No conditionals in tests. A scenario asserts the same things every time it runs. Never skip or weaken an assertion based on the environment or a runtime outcome. Make setup deterministic instead of branching on what the world contains.
- Checks that need special conditions (a real GPU, long runs, perf measurement) go in a separate layer that runs as a whole, chosen at the suite level by command or environment variable, such as a weekly perf run.
- Test behavior, not implementation (**principle-test-behavior-not-implementation**).

## Report

Say what you drove, on which surface, and what you saw: the command and its output, or the screenshot. "Inconclusive" or the wrong surface is not a pass. Say so.
