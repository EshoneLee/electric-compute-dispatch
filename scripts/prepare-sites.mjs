import { copyFile, cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectRoot, "dist");
const clientDir = path.join(outputDir, "client");
const serverDir = path.join(outputDir, "server");
const metadataDir = path.join(projectRoot, "dist", ".openai");

await rm(outputDir, { recursive: true, force: true });
await mkdir(clientDir, { recursive: true });
await mkdir(serverDir, { recursive: true });
await mkdir(metadataDir, { recursive: true });
await cp(path.join(projectRoot, "out"), clientDir, { recursive: true });
await copyFile(
  path.join(projectRoot, ".openai", "hosting.json"),
  path.join(metadataDir, "hosting.json")
);

const workerSource = `export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (!env.ASSETS) {
      return new Response("Static assets binding unavailable", { status: 500 });
    }

    const url = new URL(request.url);
    const assetPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const assetUrl = new URL(assetPath, url);
    const response = await env.ASSETS.fetch(new Request(assetUrl, request));

    if (response.status !== 404) return response;

    const fallbackUrl = new URL("/index.html", url);
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  }
};
`;

const wranglerConfig = {
  main: "index.js",
  compatibility_date: "2026-08-01",
  assets: {
    directory: "../client",
    binding: "ASSETS",
    not_found_handling: "none",
    run_worker_first: true
  }
};

await writeFile(path.join(serverDir, "index.js"), workerSource, "utf8");
await writeFile(
  path.join(serverDir, "wrangler.json"),
  `${JSON.stringify(wranglerConfig, null, 2)}\n`,
  "utf8"
);

