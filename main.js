/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { fork } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const server = fork(join(import.meta.dirname, "server.js"), { detached: true });

// The server tells us over IPC when it is listening on a port.
const port = await new Promise((resolve, reject) => {
  server.once("message", (message) => {
    if (message.status === "listening") {
      resolve(message.port);
    } else {
      reject(message);
    }
  });
});

server.disconnect();
server.unref();

writeFileSync(
  process.env.GITHUB_ENV,
  `
WIREIT_CACHE=github
WIREIT_CACHE_GITHUB_SERVER_PORT=port
`
);
