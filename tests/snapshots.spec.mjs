import { commands, page } from "vitest/browser";
import { expect, test } from "vitest";

import style from "./snapshots.css?raw";

document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`);

for (const { grammar, name } of await commands.corpus()) {
  test(`${grammar}/${name}`, async () => {
    document.body.innerHTML = `<div class="snapshot">${await commands.highlight(grammar, name)}</div>`;

    const snapshot = document.querySelector(".snapshot");

    const { width, height, right, bottom } = snapshot.getBoundingClientRect();
    snapshot.style.boxSizing = "border-box";
    snapshot.style.width = `${Math.ceil(width)}px`;
    snapshot.style.height = `${Math.ceil(height)}px`;

    await page.viewport(Math.ceil(right), Math.ceil(bottom));
    await expect(page.elementLocator(snapshot)).toMatchScreenshot(`${grammar}/test/snapshots/${name}`);
  });
}
