{
  description = "tree-sitter-cedar";

  inputs = {
    nixpkgs = {
      url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    };
  };

  # nix flake show
  outputs =
    {
      nixpkgs,
      ...
    }:

    let
      perSystem = nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed;

      systemPkgs = perSystem (
        system:

        import nixpkgs {
          inherit system;
        }
      );

      perSystemPkgs = f: perSystem (system: f (systemPkgs.${system}));
    in
    {
      devShells = perSystemPkgs (pkgs: {
        # nix develop
        default = pkgs.mkShell {
          name = "tree-sitter-cedar-shell";

          env = {
            # Nix
            NIX_PATH = "nixpkgs=${nixpkgs.outPath}";

            # C
            CPATH = pkgs.lib.makeIncludePath [
              pkgs.glibc.dev
              pkgs.tree-sitter
            ];

            # Screenshots
            PLAYWRIGHT_BROWSERS_PATH = pkgs.playwright-driver.browsers;
            FONTCONFIG_FILE = pkgs.makeFontsConf {
              fontDirectories = [ pkgs.julia-mono ];
            };
          };

          buildInputs = with pkgs; [
            # C
            clang-tools

            # Node
            nodejs
            vtsls

            # Tree Sitter
            # NOTE: Ensure `tree-sitter --version` matches version in `package.json`.
            tree-sitter

            # GitHub
            zizmor

            # Spellchecking
            typos
            typos-lsp

            # Nix
            nixfmt
            nixd
            nil
          ];
        };
      });
    };
}
