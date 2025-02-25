import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

export async function hashFromPath(path: string) {
  const hash = createHash("sha256");
  const stream = createReadStream(path);
  for await (const chunk of stream) {
    hash.update(chunk);
  }
  return hash.digest("hex");
}

export function hashFromContent(content: string) {
  return createHash("sha256").update(content).digest("hex");
}

export function decodeBase64(code: string) {
  return Buffer.from(code, "base64").toString("utf8");
}
