#!/usr/bin/env -S nix develop .#ci --command nu

# Regenerate the snapshots.
def main []: nothing -> nothing {
    npm ci
    npx vitest run --update
}
