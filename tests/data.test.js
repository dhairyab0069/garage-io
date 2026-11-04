// Checks the garage's data and pages: node tests/data.test.js
// The important one: nothing private is ever linked or named.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "assets/data.js"), "utf8"), ctx);
const G = ctx.window.GARAGE;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
let n = 0;
const ok = (name, fn) => { fn(); n++; console.log("ok", n, name); };

const symbols = [...html.matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1]);
const links = [
  ...G.logbook.map((e) => e.href).filter(Boolean),
  ...G.tools.flatMap((t) => t.links.map((l) => l.href)),
  ...G.drawers.flatMap((d) => d.items.map((i) => i.href)),
  ...G.builds.map((b) => b.href),
];
// private repos and research projects that must not appear anywhere on this public page
const PRIVATE = ["ml-course", "MotionBlind", "motiondoctor", "egoexo360", "PolymathOS", "polymathos-kernal", "engine-dev",
  "bridge-lab", "auto-rust-hal", "dspy-optimize", "semantic-search-llm", "line_integration", "project-cosc-320", "db_animation", "DevPost"];

ok("every tool has the fields the sheet shows", () => {
  for (const t of G.tools) {
    for (const k of ["id", "name", "icon", "status", "summary", "detail"]) assert.ok(t[k], `${t.id || "?"} lacks ${k}`);
    assert.ok(Number.isInteger(t.year) && t.tags.length && Array.isArray(t.links), t.id);   // a tool that is not published has no links
  }
});
ok("ids are unique", () => {
  const ids = [...G.tools.map((t) => t.id), ...G.drawers.map((d) => d.id), ...G.locked.map((l) => l.id)];
  assert.equal(new Set(ids).size, ids.length);
});
ok("every tool icon exists in the page's symbol sprite", () => {
  for (const t of G.tools) assert.ok(symbols.includes(t.icon), `${t.id} uses missing icon ${t.icon}`);
  assert.ok(symbols.includes("padlock"));
});
ok("drawers hold items with a name, a note and an https link", () => {
  for (const d of G.drawers) {
    assert.ok(d.label && d.items.length, d.id);
    for (const i of d.items) assert.ok(i.name && i.note && i.href.startsWith("https://"), `${d.id}/${i.name}`);
  }
});
ok("locked projects have a name and note and NO link of any kind", () => {
  assert.ok(G.locked.length > 0);
  for (const l of G.locked) {
    assert.ok(l.name && l.note, l.id);
    assert.deepEqual(Object.keys(l).sort(), ["id", "name", "note"], `${l.id} has extra fields (a link?)`);
  }
});
ok("every logbook entry has a title, one current name and at least two dated events", () => {
  assert.ok(G.logbook.length >= 4);
  for (const e of G.logbook) {
    assert.ok(e.id && e.title, e.id);
    assert.equal(e.names.filter((n) => n.current).length, 1, `${e.id} needs exactly one current name`);
    assert.ok(e.names.every((n) => n.name), e.id);
    assert.ok(e.events.length >= 2 && e.events.every((ev) => ev.when && ev.text), e.id);
  }
});
ok("the calendar is listed once: hw4-team-top is its old name, not a separate project", () => {
  const all = JSON.stringify({ ...G, logbook: [] });
  assert.ok(!all.includes("Homework 4"), "hw4-team-top is the calendar app");
  assert.ok(!G.drawers.some((d) => d.items.some((i) => i.href.includes("hw4-team-top"))));
  const cal = G.logbook.find((e) => e.id === "calendar");
  assert.deepEqual(Array.from(cal.names, (n) => n.name), ["hw4-team-top", "calendar-app", "Calendar"]);
});
ok("all links are https", () => assert.ok(links.every((h) => h.startsWith("https://")), links.join("\n")));
ok("no link points at a private repo", () => {
  for (const h of links) for (const p of PRIVATE) assert.ok(!h.toLowerCase().includes(p.toLowerCase()), `${h} mentions ${p}`);
  assert.ok(!links.some((h) => /github\.com\/dhairyab0069\/nextcube\/?$/.test(h)), "nextcube is private (nextcube-terminal is the public one)");
  assert.ok(!links.some((h) => /github\.com\/dhairyab0069\/FocusLock\/?$/i.test(h)), "FocusLock source is private: only its page may be linked");
});
ok("private names stay out of the page and the data, except the locked toolbox entries", () => {
  const text = html + JSON.stringify({ ...G, locked: [] });
  for (const p of ["MotionBlind", "MotionDoctor", "EgoExo", "motiondoctor", "egoexo360"]) assert.ok(!text.includes(p), `${p} appears`);
});
ok("every script and stylesheet the page loads exists", () => {
  for (const m of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) assert.ok(fs.existsSync(path.join(root, m[1])), m[1]);
});
ok("shared light/dark/auto theme: key, early script before the stylesheet, radiogroup", () => {
  const early = html.indexOf("localStorage.getItem('theme')");
  assert.ok(early > 0 && early < html.indexOf('rel="stylesheet"'));
  assert.ok(html.includes('role="radiogroup" aria-label="Color theme"'));
  assert.ok((html.match(/data-theme-mode="(light|dark|auto)"/g) || []).length >= 3);
  assert.ok(fs.readFileSync(path.join(root, "assets/theme.js"), "utf8").includes("localStorage.setItem('theme'"));
});
ok("symbol controls (door and top bar), defaults on, versioned keys, no external requests", () => {
  const ctl = fs.readFileSync(path.join(root, "assets/controls.js"), "utf8");
  for (const k of ["sound", "motion", "fx", "quiet"])
    assert.equal((html.match(new RegExp(`data-ctl="${k}"[^>]*aria-pressed="${k === "quiet" ? "false" : "true"}"`, "g")) || []).length, 2, `${k}: one on the door, one in the top bar`);
  assert.ok(/get\("sound"\) !== "off"/.test(ctl) && /get\("fx"\) !== "off"/.test(ctl) && ctl.includes('"garage2"'));
  assert.ok(!/data-sound-switch|class="snd"/.test(html));
  const external = [];
  for (const f of ["index.html", ...fs.readdirSync(path.join(root, "assets")).filter((x) => /\.(js|css)$/.test(x)).map((x) => "assets/" + x)]) {
    const t = fs.readFileSync(path.join(root, f), "utf8");
    if (f === "assets/data.js") continue;                                   // outbound project links are data, not requests
    for (const m of t.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)) if (!/rel="(canonical)"/.test(m[0]) && !/^https:\/\/(github\.com|dhairyab0069\.github\.io)/.test(m[1])) external.push(f + " " + m[1]);
    for (const m of t.matchAll(/url\(\s*["']?https?:|@import\s+["']?https?:|fetch\(\s*["']https?:/g)) external.push(f + " " + m[0]);
  }
  assert.deepEqual(external, []);
});
console.log(`${n} checks passed`);
