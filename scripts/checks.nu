#!/usr/bin/env -S nix develop .#ci --command nu

# Run all linters and formatters.
def main []: nothing -> nothing {
    # Git
    let origin: record<stdout: string, stderr: string, exit_code: int> = do { git rev-parse --verify origin/main } | complete
    let main: string = if $origin.exit_code == 0 {
        $origin.stdout | str trim
    } else {
        git rev-parse --verify main | str trim
    }

    let merge: record<stdout: string, stderr: string, exit_code: int> = do { git merge-base $main HEAD } | complete
    let base: string = $merge.stdout | str trim
    if $base != (git rev-parse HEAD | str trim) {
        committed $"($base)..HEAD"
    }

    # GitHub
    zizmor --pedantic .github

    # Spellchecking
    typos

    # Markdown
    lychee --verbose .

    # Tree Sitter
    tree-sitter-check

    npm ci
    npx vitest run

    # Nushell
    let scripts: list<string> = glob "scripts/**/*.nu"
    nufmt --dry-run ...$scripts

    for script: string in $scripts {
        let diagnostics: string = do { nu --ide-check 100 $script } | complete | get stdout
        if ($diagnostics | str contains '"type":"diagnostic"') {
            print $"nu diagnostics in ($script):"
            print $diagnostics
            exit 1
        }
    }

    # TOML
    tombi lint --error-on-warnings

    # Nix
    nix flake check
    nixfmt --check --width=120 ...(git ls-files "*.nix" | lines)
    deadnix --fail .
}

def tree-sitter-check []: nothing -> nothing {
    let grammars: list<string> = open tree-sitter.json | get grammars | get path

    for grammar in $grammars {
        do {
            cd $grammar
            tree-sitter generate
        }
    }

    let dirty = git status --porcelain -- "*/src/*" | str trim
    if $dirty != "" {
        print "parsers are stale:"
        print $dirty
        exit 1
    }

    for grammar in $grammars {
        do {
            cd $grammar
            tree-sitter test
        }
    }

    for grammar in $grammars {
        ts_query_ls check --format $"($grammar)/queries"
    }
}
