import { resolve } from "path";

import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

import { corpus, highlight } from "./tests/commands.js";

export default defineConfig({
  test: {
    include: ["tests/*.spec.js"],

    browser: {
      enabled: true,
      headless: true,

      provider: playwright({
        launchOptions: {
          args: [
            "--disable-font-subpixel-positioning",
            "--disable-gpu",
            "--disable-lcd-text",
            "--disable-skia-runtime-opts",
            "--font-render-hinting=none",
            "--force-color-profile=srgb"
          ]
        },

        contextOptions: {
          deviceScaleFactor: 2,
        },
      }),

      instances: [
        {
          browser: "chromium"
        }
      ],

      commands: {
        corpus,
        highlight
      },

      expect: {
        toMatchScreenshot: {
          resolveScreenshotPath: ({ arg, ext, root }) => resolve(root, `${arg}${ext}`)
        }
      }
    }
  }
});
