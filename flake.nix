{
  description = "tree-sitter-cedar";

  inputs = {
    nixpkgs = {
      url = "github:NixOS/nixpkgs/nixos-unstable-small";
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
      devShells = perSystemPkgs (pkgs:

      {
        # nix develop
        default = pkgs.mkShell {
          name = "tree-sitter-cedar-shell";

          env = {
            # Nix
            NIX_PATH = "nixpkgs=${nixpkgs.outPath}";

            # Snapshots
            PLAYWRIGHT_BROWSERS_PATH = pkgs.playwright-driver.browsers;
            FONTCONFIG_FILE = pkgs.makeFontsConf {
              fontDirectories = [ pkgs.julia-mono ];
            };
          };

          buildInputs = with pkgs; [
            # Node
            nodejs
            vtsls

            # Tree Sitter
            tree-sitter

            # Policy
            cedar

            # Snapshots
            pngquant

            # Nix
            deadnix
            nil
            nixd
            nixfmt

            # Spellchecking
            typos
            typos-lsp

            # Markdown
            lychee

            # TOML
            tombi

            # YAML
            yaml-language-server

            # JSON
            jq
            vscode-langservers-extracted

            # Nushell
            nushell
            nufmt

            # Git
            committed

            # GitHub
            gh
            pinact
            zizmor
          ];
        };

        # nix develop .#ci
        ci = pkgs.mkShell {
          name = "tree-sitter-cedar-ci-shell";

          env = {
            # Snapshots
            PLAYWRIGHT_BROWSERS_PATH = pkgs.playwright-driver.browsers;
            FONTCONFIG_FILE = pkgs.makeFontsConf {
              fontDirectories = [ pkgs.julia-mono ];
            };
          };

          buildInputs = with pkgs; [
            # Node
            nodejs

            # Tree Sitter
            tree-sitter

            # Snapshots
            pngquant

            # Nix
            deadnix
            nixfmt

            # Spellchecking
            typos

            # Markdown
            lychee

            # TOML
            tombi

            # JSON
            jq

            # Nushell
            nushell
            nufmt

            # Git
            committed

            # GitHub
            zizmor
          ];
        };
      });
    };
}
