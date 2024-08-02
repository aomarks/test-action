/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { fork } from "node:child_process";

const server = fork("server.js", { detached: true });

server.on("message", (message) => {
  if (message === "ready") {
    server.disconnect();
    server.unref();
  }
});
