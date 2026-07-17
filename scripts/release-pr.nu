#!/usr/bin/env -S nix develop --command nu

# Open a release PR.
def main []: nothing -> nothing {
    let token: string = gh auth token | str trim

    (
        npx release-please release-pr
            --repo-url DuskSystems/tree-sitter-cedar
            --token $token
    )
}
