/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import http from "node:http";

const response = JSON.stringify(
  {
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

const server = http.createServer((req, res) => {
  if (req.path === "/kill") {
    console.log("Shutting down");
    server.close();
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(response);
  }
});

const version = (await import("./package.json", { with: { type: "json" } }))
  .default.version;

const port = 9999;

server.listen(port, "127.0.0.1", () => {
  process.send({ port });
});
