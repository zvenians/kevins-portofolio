import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const valueAfter = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const host = valueAfter("--host", "0.0.0.0");
const port = valueAfter("--port", "3000");
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "-H", host, "-p", port], { stdio: "inherit" });
child.on("exit", code => process.exit(code ?? 0));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
