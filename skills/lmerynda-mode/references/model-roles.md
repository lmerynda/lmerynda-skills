# Model roles

Skills ported from pstack read a role line from this file. A role's value is what you pass as the subagent's model.

## Values

- `opus`, `sonnet`, `haiku`. Claude models. In Claude Code, pass the value as the Agent tool's `model`. In Codex, they are not available as subagents, so use the Codex row's value instead.
- `codex`. The other model family. From Claude Code, run the seat as `codex exec` in its own worktree (`codex exec -C <worktree> "<brief>"`), with the brief in the prompt and the result read from its output. From Codex, it is a native subagent on the configured Codex model.
- `inherit-parent`. Leave `model` unset so the subagent runs on the parent's model.

The user's named model and reasoning level for a role always win over this table.

## Roles

| role line | Claude Code | Codex |
|---|---|---|
| `feature, refactoring` | `sonnet` | `inherit-parent`, medium effort |
| `bug-fix` | `sonnet` | `inherit-parent`, high effort |
| `perf-issue` | `sonnet` | `inherit-parent`, high effort |
| `hillclimb` | `sonnet` | `inherit-parent`, medium effort |
| `hardest tasks` | `opus` | `inherit-parent`, xhigh effort |
| `judgment and prose` | `opus` | `inherit-parent`, high effort |
| `how explorer` | `sonnet` | `inherit-parent`, medium effort |
| `how explainer` | `opus` | `inherit-parent`, high effort |
| `swarm workers` | `sonnet` | `inherit-parent`, medium effort |
| `arena runners` | `opus`, `codex` | `inherit-parent` at high and xhigh effort |
| `arena cross-judge pool` | `codex`, `opus` | `inherit-parent`, xhigh effort |
| `architect runners` | `opus`, `codex` | `inherit-parent` at high and xhigh effort |
| `interrogate reviewers` | `opus`, `codex`, `sonnet` | `inherit-parent` at high and xhigh effort |
| `reflect tooling` | `sonnet` | `inherit-parent`, medium effort |
| `reflect judgment, divergent, synthesizer` | `opus` | `inherit-parent`, high effort |
| `transcript mining` | `haiku` | `inherit-parent`, low effort |

Cross-family seats matter most for judges and adversaries, because a judge from the author's family shares its blind spots. Codex has no Claude seat available, so a Codex parent varies the reasoning effort instead and says the panel was single-family.
