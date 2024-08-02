/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { writeFileSync } from "node:fs";
import http from "node:http";
import packageJson from "./package.json" with { type: "json" };

const response = JSON.stringify({
  version: packageJson.version,
  caching: {
    // These environment variables are automatically provided to invoked
    // workflows like this one, but not to regular "run" steps, so we need to
    // serve them for subsequent Wireit processes.
    github: {
      // URL for the GitHub Actions cache service.
      ACTIONS_CACHE_URL: process.env.ACTIONS_CACHE_URL,
      // A secret token for authenticating to the GitHub Actions cache service.
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

let port;
const MAX_TRIES = 4;
for (let i = 0; port === undefined && i < MAX_TRIES; i++) {
  await new Promise((resolve) => {
    const candidate = randIntInclusive(49152, 65535);
    console.log(`Trying port ${candidate}`);
    server.once("error", resolve);
    server.listen(candidate, () => {
      port = candidate;
      resolve();
    });
  });
}

if (!port) {
  console.error("Could not find a free port");
  process.send(1, () => process.exit(1));
} else {
  console.log(`Listening on port ${port}`);

  // Writing to this file sets environment variables for all subsequent steps in
  // the user's workflow. Reference:
  // https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-environment-variable
  writeFileSync(
    process.env.GITHUB_ENV,
    `
WIREIT_CACHE=github
WIREIT_CACHE_GITHUB_SERVER_PORT=${port}
`
  );

  process.send(0);
}
