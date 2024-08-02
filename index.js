/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { fork } from "node:child_process";
import { writeFileSync } from "node:fs";

const version = (await import("./package.json", { with: { type: "json" } }))
  .default.version;

const server = fork("server.js", { detached: true });

const port = await new Promise((resolve) => {
  server.on("message", ({ port }) => resolve(port));
});

server.disconnect();
server.unref();

writeFileSync(
  process.env.GITHUB_ENV,
  `
WIREIT_CACHE=github
WIREIT_GITHUB_SERVER=${JSON.stringify({ version, port })}
`
);
