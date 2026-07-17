{
  lib,
  pkgsCross,
  tree-sitter,
  tree-sitter-cedarschema,
  version,
}:

tree-sitter.buildGrammar {
  inherit version;
  language = "cedarschema";

  src = lib.fileset.toSource {
    root = ../../../cedarschema;
    fileset = lib.fileset.unions [
      ../../../cedarschema/src
      ../../../cedarschema/queries
    ];
  };

  passthru = {
    wasm = tree-sitter-cedarschema.override {
      tree-sitter = pkgsCross.wasi32.tree-sitter;
    };
  };

  meta = {
    description = "Cedar schema grammar for tree-sitter";
    homepage = "https://github.com/DuskSystems/tree-sitter-cedar";
    license = with lib.licenses; [
      mit
      asl20
    ];
  };
}
