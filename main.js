/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { fork } from "node:child_process";
import { join } from "node:path";

// The purpose of this script is to launch the server in the background and
// block subsequent steps until it is ready. We use a simple IPC protocol where
// the server will send us a message with 0 when it is listening and 1 if it
// encountered an error.

const server = fork(join(import.meta.dirname, "server.js"), {
  detached: true,
  stdio: "inherit",
});
server.on("message", (code) => process.exit(code));
