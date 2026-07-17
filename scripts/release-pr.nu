#!/usr/bin/env -S nix develop --command nu

# Open a release PR.
def main []: nothing -> nothing {
    if (git branch --show-current | str trim) != "main" {
        print "Current branch is not main"
        exit 1
    }

    if (git status --porcelain | str trim) != "" {
        print "Dirty working tree"
        exit 1
    }

    let token: string = gh auth token | str trim

    (
        npx release-please release-pr
            --repo-url DuskSystems/tree-sitter-cedar
            --token $token
            --draft-pull-request
    )

    let branches = (
        gh pr list --state open --json headRefName,title
        | from json
        | where title =~ '^chore: Release'
        | get headRefName
    )

    if ($branches | is-empty) {
        return
    }

    let branch = $branches | first
    git fetch origin $branch
    git checkout $branch

    let grammars: list<string> = open tree-sitter.json | get grammars | get path
    for grammar in $grammars {
        do {
            cd $grammar
            tree-sitter generate
        }
    }

    git commit --all --amend --no-edit
    git push --force-with-lease

    gh pr ready
    git checkout main
    git branch -d $branch
}
