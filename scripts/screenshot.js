#!/usr/bin/env node

const { execSync } = require("child_process");
const { chromium } = require("playwright-core");

(async () => {
  const [src, output] = process.argv.slice(2);
  if (!src || !output) {
    return console.error("Usage: screenshot.js <source-file> <output.png>");
  }

  const html = execSync(`tree-sitter highlight --html --css-classes "${src}"`, {
    encoding: "utf8"
  });

  const browser = await chromium.launch();

  const page = await browser.newPage({
    deviceScaleFactor: 2,
    viewport: {
      width: 1024,
      height: 1
    }
  });

  await page.setContent(html);
  await page.addStyleTag({ path: "scripts/screenshot.css" });

  const body = await page.$("body");
  await body.screenshot({ path: output, omitBackground: true });

  await browser.close();
})();
