import { readFileSync } from "fs";
import { join } from "path";

console.log("CLEANUP TIME!");

console.log(
  readFileSync(
    join(process.env.RUNNER_TEMP, ".wireit-github-cache-info"),
    "utf8"
  )
);
