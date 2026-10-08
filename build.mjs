import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderPage } from "./src/render.mjs";

const root = import.meta.dirname;
const dist = join(root, "dist");

let resume;
try {
  resume = JSON.parse(readFileSync(join(root, "resume.json"), "utf8"));
} catch (error) {
  console.error(`Could not read resume.json: ${error.message}`);
  process.exit(1);
}

const missing = ["name", "email"].filter((field) => !resume.basics?.[field]);
if (missing.length > 0) {
  console.error(`resume.json is missing required field(s): ${missing.map((f) => `basics.${f}`).join(", ")}`);
  process.exit(1);
}

mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, "index.html"), renderPage(resume));
copyFileSync(join(root, "src", "styles.css"), join(dist, "styles.css"));

console.log("Built dist/index.html");
