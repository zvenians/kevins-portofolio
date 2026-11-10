import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const args = process.argv.slice(2);
const valueAfter = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const host = valueAfter("--host", "0.0.0.0");
const port = valueAfter("--port", "3000");
const require = createRequire(import.meta.url);
const nextBin = join(dirname(require.resolve("next/package.json")), "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, "dev", "--webpack", "-H", host, "-p", port], { stdio: "inherit" });
child.on("exit", code => process.exit(code ?? 0));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
