/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import http from "node:http";

const version = (await import("./package.json", { with: { type: "json" } }))
  .default.version;

const response = JSON.stringify(
  {
    version,
    caching: {
      github: {
        ACTIONS_CACHE_URL: process.env.ACTIONS_CACHE_URL,
        ACTIONS_RUNTIME_TOKEN: process.env.ACTIONS_RUNTIME_TOKEN,
      },
    },
  },
  null,
  2
);

const server = http.createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(response);
});

const MAX_ATTEMPTS = 5;

for (let i = 0; i < MAX_ATTEMPTS; i++) {
  const min = 49152;
  const max = 65535;
  const port = Math.floor(Math.random() * (max - min + 1) + min);
  const result = await new Promise((resolve, reject) => {
    server.on(
      "error",
      (error) => {
        if (error.code === "EADDRINUSE") {
          resolve("INUSE");
        } else {
          reject(error);
        }
      },
      { once: true }
    );
    server.listen(port, "127.0.0.1", () => {
      resolve("OK");
    });
  });
  if (result === "OK") {
    process.send({ port });
    break;
  }
}
