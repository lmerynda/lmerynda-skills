#!/usr/bin/env sh
# Install the steering file, skills and agents for Claude Code and Codex.
# The steering file goes in a marked block, so anything else in CLAUDE.md or AGENTS.md is kept.
set -eu
root="$(cd "$(dirname "$0")" && pwd)"
begin='<!-- lmerynda-skills:steering:begin -->'
end='<!-- lmerynda-skills:steering:end -->'

install_steering() {
  target="$1"
  mkdir -p "$(dirname "$target")"
  touch "$target"
  kept="$(awk -v b="$begin" -v e="$end" '$0==b{skip=1} !skip{print} $0==e{skip=0}' "$target")"
  {
    [ -n "$kept" ] && printf '%s\n\n' "$kept"
    printf '%s\n' "$begin"
    cat "$root/core/steering.md"
    printf '%s\n' "$end"
  } > "$target.tmp"
  mv "$target.tmp" "$target"
  echo "steering -> $target"
}

install_steering "$HOME/.claude/CLAUDE.md"
install_steering "$HOME/.codex/AGENTS.md"

for dest in "$HOME/.claude/skills" "$HOME/.codex/skills"; do
  for skill in "$root"/skills/*/; do
    name="$(basename "$skill")"
    rm -rf "${dest:?}/$name"
    mkdir -p "$dest/$name"
    cp -R "$skill". "$dest/$name/"
  done
  echo "skills -> $dest ($(ls -d "$root"/skills/*/ | wc -l | tr -d ' '))"
done

mkdir -p "$HOME/.claude/agents"
cp "$root"/agents/*.md "$HOME/.claude/agents/"
echo "agents -> $HOME/.claude/agents"
