{
  lib,
  pkgsCross,
  tree-sitter,
  tree-sitter-cedar,
  version,
}:

tree-sitter.buildGrammar {
  inherit version;
  language = "cedar";

  src = lib.fileset.toSource {
    root = ../../../cedar;
    fileset = lib.fileset.unions [
      ../../../cedar/src
      ../../../cedar/queries
    ];
  };

  passthru = {
    wasm = tree-sitter-cedar.override {
      tree-sitter = pkgsCross.wasi32.tree-sitter;
    };
  };

  meta = {
    description = "Cedar policy grammar for tree-sitter";
    homepage = "https://github.com/DuskSystems/tree-sitter-cedar";
    license = with lib.licenses; [
      mit
      asl20
    ];
  };
}
