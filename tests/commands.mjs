import { execFileSync } from "child_process";
import { join, basename } from "path";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, readdirSync } from "fs";
import { tmpdir } from "os";

const tmp = mkdtempSync(join(tmpdir(), "tree-sitter-cedar-"));

const separator = "=".repeat(80);
const divider = "-".repeat(80);

const config = {
  "theme": {
    "attribute": 0,
    "boolean": 0,
    "comment": 0,
    "function": 0,
    "keyword": 0,
    "module": 0,
    "number": 0,
    "operator": 0,
    "property": 0,
    "punctuation.bracket": 0,
    "punctuation.delimiter": 0,
    "punctuation.special": 0,
    "string": 0,
    "string.escape": 0,
    "type": 0,
    "variable": 0,
    "variable.parameter": 0
  }
};

const configDir = join(tmp, "config");
mkdirSync(configDir);
writeFileSync(join(configDir, "config.json"), JSON.stringify(config));

// Every corpus test, per grammar.
export async function corpus() {
  const { grammars } = JSON.parse(readFileSync("tree-sitter.json", "utf8"));

  return grammars.flatMap((grammar) => {
    const corpusDir = join(grammar.path, "test", "corpus");

    return readdirSync(corpusDir, { recursive: true })
      .filter((entry) => entry.endsWith(".txt"))
      .sort()
      .map((entry) => ({
        grammar: grammar.name,
        name: entry.slice(0, -".txt".length)
      }));
  });
}

// Extract and highlight source from test text.
//
// ```txt
// ================================================================================
// <TEST NAME>
// ================================================================================
//
// <CONTENT>
//
// --------------------------------------------------------------------------------
// <AST>
// ```
export async function highlight(_context, grammar, name) {
  const lines = readFileSync(join(grammar, "test", "corpus", `${name}.txt`), "utf8").split("\n");

  const start = lines.indexOf(separator, 1) + 1;
  const end = lines.indexOf(divider);
  const source = lines
    .slice(start, end)
    .filter((line) => !line.startsWith("// https://"))
    .join("\n");

  const sourceFile = join(tmp, `${basename(name)}.${grammar}`);
  writeFileSync(sourceFile, `${source.trim()}\n`);

  const html = execFileSync("tree-sitter", ["highlight", "--html", "--css-classes", sourceFile], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    env: {
      ...process.env,
      TREE_SITTER_DIR: configDir
    }
  });

  const [table] = html.match(/<table>.*<\/table>/s);
  return table;
}
