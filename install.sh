#!/usr/bin/env sh
# Copy every skill in skills/ into the Claude Code and Codex user skill directories.
set -eu
src="$(cd "$(dirname "$0")" && pwd)/skills"
for dest in "$HOME/.claude/skills" "$HOME/.codex/skills"; do
  for skill in "$src"/*/; do
    name="$(basename "$skill")"
    mkdir -p "$dest/$name"
    cp -R "$skill". "$dest/$name/"
    echo "installed $dest/$name"
  done
done
