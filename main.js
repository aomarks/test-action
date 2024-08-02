/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { fork } from "node:child_process";
import { writeFileSync } from "node:fs";

const server = fork("./server.js", { detached: true });

const port = await new Promise((resolve) => {
  server.on("message", ({ port }) => resolve(port));
});

server.disconnect();
server.unref();

writeFileSync(
  process.env.GITHUB_ENV,
  `
WIREIT_CACHE=github
WIREIT_CACHE_GITHUB_SERVER_PORT=${port}
`
);
