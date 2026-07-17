#!/usr/bin/env -S nix develop .#ci --command nu

# Build the WebAssembly parsers.
def main []: nothing -> nothing {
    for lang: string in [cedar cedarschema cedarentities] {
        let out: string = nix build --no-link --print-out-paths $".#tree-sitter-($lang).wasm" | str trim
        open --raw $"($out)/parser.wasm" | save --force $"tree-sitter-($lang).wasm"
    }
}
