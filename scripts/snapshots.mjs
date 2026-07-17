#!/usr/bin/env -S nix develop .#ci --command node

import { chromium } from "playwright-core";
import { execFileSync } from "child_process";
import { join, basename, dirname } from "path";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, readdirSync } from "fs";
import { tmpdir } from "os";

const tmp = mkdtempSync(join(tmpdir(), "tree-sitter-cedar-"));

const separator = "=".repeat(80);
const divider = "-".repeat(80);

const browser = await chromium.launch();
const page = await browser.newPage({
  deviceScaleFactor: 2,
});

const config = JSON.parse(readFileSync("tree-sitter.json", "utf8"));
const style = readFileSync("scripts/snapshots.css", "utf8");

for (const grammar of config.grammars) {
  const corpusDir = join(grammar.path, "test", "corpus");
  const snapshotDir = join(grammar.path, "test", "snapshots");

  rmSync(snapshotDir, {
    recursive: true,
    force: true
  });

  const tests = readdirSync(corpusDir, { recursive: true })
    .filter((entry) => entry.endsWith(".txt"))
    .sort();

  for (const test of tests) {
    const name = test.slice(0, -".txt".length);

    // Extract source from test.
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
    const lines = readFileSync(join(corpusDir, test), "utf8").split("\n");

    const start = lines.indexOf(separator, 1) + 1;
    const end = lines.indexOf(divider);
    const source = lines
      .slice(start, end)
      .filter((line) => !line.startsWith("// https://"))
      .join("\n");

    const sourceFile = join(tmp, `${basename(name)}.${grammar.name}`);
    writeFileSync(sourceFile, `${source.trim()}\n`);

    const html = execFileSync("tree-sitter", ["highlight", "--html", "--css-classes", sourceFile], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });

    const [table] = html.match(/<table>.*<\/table>/s);
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>${style}</style>${table}`);

    const output = join(snapshotDir, `${name}.png`);
    mkdirSync(dirname(output), {
      recursive: true
    });

    const body = await page.$("body");
    await body.screenshot({
      path: output,
      omitBackground: true
    });

    execFileSync("pngquant", ["--force", "--ext", ".png", output]);
  }

  console.log(`${grammar.name}: ${tests.length} snapshots`);
}

await browser.close();
