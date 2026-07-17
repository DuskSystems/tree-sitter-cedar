{
  lib,
  pkgsCross,
  tree-sitter,
  tree-sitter-cedarentities,
  version,
}:

tree-sitter.buildGrammar {
  inherit version;
  language = "cedarentities";

  src = lib.fileset.toSource {
    root = ../../../cedarentities;
    fileset = lib.fileset.unions [
      ../../../cedarentities/src
      ../../../cedarentities/queries
    ];
  };

  passthru = {
    wasm = tree-sitter-cedarentities.override {
      tree-sitter = pkgsCross.wasi32.tree-sitter;
    };
  };

  meta = {
    description = "Cedar entities grammar for tree-sitter";
    homepage = "https://github.com/DuskSystems/tree-sitter-cedar";
    license = with lib.licenses; [
      mit
      asl20
    ];
  };
}
