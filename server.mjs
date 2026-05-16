import { createServer } from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = 5173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".wasm": "application/wasm",
  ".json": "application/json",
};

function resolveFile(urlPath) {
  const rel = urlPath.replace(/^\//, "").replace(/\.\./g, "");
  const candidates = [
    join(root, rel),
    join(root, "public", rel),
  ];
  if (urlPath === "/" || urlPath === "/standalone.html") {
    candidates.unshift(join(root, "standalone.html"));
  }
  for (const p of candidates) {
    if (p.startsWith(root) && existsSync(p) && statSync(p).isFile()) {
      return p;
    }
  }
  return null;
}

createServer((req, res) => {
  let urlPath = req.url?.split("?")[0] || "/";
  if (urlPath === "/") urlPath = "/standalone.html";

  const filePath = resolveFile(urlPath);

  if (!filePath) {
    res.writeHead(404);
    res.end("Not found: " + urlPath);
    return;
  }

  const ext = extname(filePath);
  res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
  res.end(readFileSync(filePath));
}).listen(port, () => {
  console.log(`Creator Vault + TokenCore: http://localhost:${port}`);
});
