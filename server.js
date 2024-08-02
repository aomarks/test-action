/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import http from "node:http";
import { version } from "./package.json" with { type: "json" };

const response = JSON.stringify({
  version,
  caching: {
    github: {
      ACTIONS_CACHE_URL: process.env.ACTIONS_CACHE_URL,
      ACTIONS_RUNTIME_TOKEN: process.env.ACTIONS_RUNTIME_TOKEN,
    },
  },
});

const server = http.createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(response);
});

function randIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const MAX_PORT_ATTEMPTS = 4;

let result;
for (let i = 0; result === undefined && i < MAX_PORT_ATTEMPTS; i++) {
  await new Promise((resolve) => {
    const port = randIntInclusive(49152, 65535);
    server.listen(port, () => {
      result = { status: "listening", port };
      resolve();
    });
    server.once("error", ({ code }) => {
      if (code !== "EADDRINUSE") {
        result = { status: "error", code };
      }
      resolve();
    });
  });
}

process.send(result);
