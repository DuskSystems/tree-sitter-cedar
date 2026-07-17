#!/usr/bin/env -S nix develop .#ci --command nu

# Create the GitHub release and publish to npm.
def main []: nothing -> nothing {
    if ($env.CI? | default "false") != "true" {
        exit 1
    }

    let message: string = git log -1 --format=%s | str trim
    if not ($message | str starts-with "chore: Release v") {
        exit 0
    }

    npm ci
    ./scripts/wasm.nu

    (
        npx release-please github-release
            --repo-url DuskSystems/tree-sitter-cedar
            --token $env.GITHUB_TOKEN
    )

    let version: string = open package.json | get version
    gh release upload $"v($version)" ...(glob "tree-sitter-*.wasm") --clobber

    npm publish --provenance --access public
}
