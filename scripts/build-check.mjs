import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(resolve(root, "index.html"), "utf8");
const vercel = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));

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
  ["Babel app script exists", html.includes('type="text/babel"')],
  ["Public invitation route exists", html.includes("PublicInvitationPage")],
  ["Shareable data encoder exists", html.includes("encodeInvitePayload")],
  ["Shareable data decoder exists", html.includes("decodeInvitePayload")],
  ["No eval usage", !html.includes("eval(")],
  ["Vercel invitation rewrite exists", vercel.rewrites?.some((rule) => rule.source === "/invitacion")]
];

for (const id of requiredStyles) {
  checks.push([`Style ${id} registered`, html.includes(`id:'${id}'`)]);
}

const failed = checks.filter(([, passed]) => !passed);

if (failed.length) {
  for (const [label] of failed) {
    console.error(`x ${label}`);
  }
  process.exit(1);
}

console.log(`Static build check passed: ${checks.length} checks.`);
