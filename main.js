/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { fork } from "node:child_process";
import { join } from "node:path";

const server = fork(join(import.meta.dirname, "server.js"), { detached: true });
server.on("message", (code) => process.exit(code));
