import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(resolve(root, "index.html"), "utf8");
const app = readFileSync(resolve(root, "src/App.jsx"), "utf8");
const styleData = readFileSync(resolve(root, "src/data/invitationStyles.ts"), "utf8");
const vercel = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
const outputDir = resolve(root, "dist");

const requiredStyles = [
  "honey",
  "floral",
  "minimal",
  "celestial",
  "safari",
  "coquette"
];

const checks = [
  ["React root exists", html.includes('<div id="root"></div>')],
  ["Vite module entry exists", html.includes('type="module" src="/src/main.jsx"')],
  ["No Babel runtime script", !html.includes("text/babel") && !html.includes("@babel/standalone")],
  ["Public invitation route exists", app.includes("PublicInvitationPage")],
  ["Shareable data encoder exists", app.includes("encodeInvitePayload")],
  ["Shareable data decoder exists", app.includes("decodeInvitePayload")],
  ["No eval usage", !html.includes("eval(") && !app.includes("eval(")],
  ["Dist index generated", existsSync(resolve(outputDir, "index.html"))],
  ["Vercel invitation rewrite exists", vercel.rewrites?.some((rule) => rule.source === "/invitacion")]
];

for (const id of requiredStyles) {
  checks.push([`Style ${id} registered`, styleData.includes(`id: "${id}"`)]);
}

const failed = checks.filter(([, passed]) => !passed);

if (failed.length) {
  for (const [label] of failed) {
    console.error(`x ${label}`);
  }
  process.exit(1);
}

console.log(`Production build check passed: ${checks.length} checks. Output written to dist/.`);
