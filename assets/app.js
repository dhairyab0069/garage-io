/* The garage: draws everything from window.GARAGE and runs the door, the lights, the dust, the sparks,
   the drawers and the details sheet. Sounds come from window.Sfx (assets/sound.js) and do nothing until switched on. */
(function () {
  "use strict";
  var G = window.GARAGE, Sfx = window.Sfx || { play: function () {} };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s) { return document.querySelector(s); };
  var NS = "http://www.w3.org/2000/svg";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon(name, cls) {
    var s = document.createElementNS(NS, "svg"), u = document.createElementNS(NS, "use");
    s.setAttribute("class", cls || "icon"); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false");
    u.setAttribute("href", "#" + name); s.appendChild(u);
    return s;
  }
  function link(label, href) {
    var a = el("a", "", label + " ↗");
    a.href = href; a.target = "_blank"; a.rel = "noopener";
    return a;
  }

  /* ---------- the details sheet ---------- */
  var sheet = $("#sheet"), body = $("#sheet-body"), closeBtn = $("#sheet-close"), current = null;

  function openSheet(tool, slot, trigger) {
    if (current) current.slot.classList.remove("taken");
    body.textContent = "";
    body.appendChild(el("h3", "", tool.name));
    body.appendChild(el("span", "stamp", tool.status + " · " + tool.year));
    body.appendChild(el("p", "", tool.summary));
    body.appendChild(el("p", "", tool.detail));
    var chips = el("ul", "chips");
    tool.tags.forEach(function (t) { chips.appendChild(el("li", "", t)); });
    body.appendChild(chips);
    var links = el("div", "links");
    tool.links.forEach(function (l) { links.appendChild(link(l.label, l.href)); });
    body.appendChild(links);
    slot.classList.add("taken");
    current = { tool: tool, slot: slot, trigger: trigger };
    sheet.inert = false; sheet.setAttribute("aria-hidden", "false");
    sheet.classList.add("show");
    Sfx.play("take"); setTimeout(function () { Sfx.play("sheet"); }, 120);
    closeBtn.focus({ preventScroll: true });
  }
  function closeSheet() {
    if (!current) return;
    var c = current; current = null;
    c.slot.classList.remove("taken");
    sheet.classList.remove("show"); sheet.inert = true; sheet.setAttribute("aria-hidden", "true");
    Sfx.play("put");
    if (c.trigger) c.trigger.focus({ preventScroll: true });
  }
  closeBtn.addEventListener("click", closeSheet);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });
  document.addEventListener("pointerdown", function (e) {
    if (current && !sheet.contains(e.target) && !e.target.closest(".tool")) closeSheet();
  });

  /* ---------- the pegboard ---------- */
  var tools = $("#tools");
  G.tools.forEach(function (t) {
    var slot = el("div", "slot"), b = el("button", "tool");
    b.type = "button"; b.setAttribute("aria-label", t.name + ", " + t.status + ". Take it off the wall.");
    b.appendChild(icon(t.icon));
    var tag = el("span", "tag"); tag.appendChild(el("b", "", t.name)); tag.appendChild(el("small", "", t.status));
    b.appendChild(tag);
    b.addEventListener("pointerenter", function () { Sfx.play("ratchet"); });
    b.addEventListener("click", function () { openSheet(t, slot, b); });
    slot.appendChild(b); tools.appendChild(slot);
  });

  /* ---------- the tool chest ---------- */
  var chest = $("#drawers");
  G.drawers.forEach(function (d) {
    var wrap = el("div", "drawer"), front = el("button", "drawer-front"), tray = el("div", "tray"), inner = el("div", "tray-in"), ul = el("ul");
    front.type = "button"; front.setAttribute("aria-expanded", "false"); front.setAttribute("aria-controls", d.id);
    front.appendChild(el("span", "drawer-name", d.label));
    front.appendChild(el("span", "drawer-count", d.items.length + (d.items.length === 1 ? " item" : " items")));
    tray.id = d.id; inner.inert = true;
    d.items.forEach(function (it) {
      var li = el("li"); li.appendChild(el("b", "", it.name)); li.appendChild(el("p", "", it.note));
      li.appendChild(link("Open", it.href)); ul.appendChild(li);
    });
    inner.appendChild(ul); tray.appendChild(inner);
    front.addEventListener("click", function () {
      var open = !wrap.classList.contains("open");
      wrap.classList.toggle("open", open); front.setAttribute("aria-expanded", String(open)); inner.inert = !open;
      Sfx.play(open ? "open" : "shut");
    });
    front.addEventListener("pointerenter", function () { Sfx.play("ratchet"); });
    wrap.appendChild(front); wrap.appendChild(tray); chest.appendChild(wrap);
  });

  /* ---------- the locked toolbox ---------- */
  var boxes = $("#lockboxes");
  G.locked.forEach(function (p) {
    var b = el("button", "lockbox"), note = el("p", "", p.note + " The code is private, so there is no link.");
    b.type = "button"; b.setAttribute("aria-expanded", "false");
    b.appendChild(icon("padlock")); b.appendChild(el("b", "", p.name)); b.appendChild(el("small", "", "Private · press to rattle"));
    note.hidden = true; b.appendChild(note);
    b.addEventListener("click", function () {
      b.classList.remove("rattle"); void b.offsetWidth; b.classList.add("rattle");
      note.hidden = !note.hidden; b.setAttribute("aria-expanded", String(!note.hidden));
      Sfx.play("lock");
    });
    boxes.appendChild(b);
  });

  /* ---------- the logbook: what each project was called, and when ---------- */
  var log = $("#log");
  G.logbook.forEach(function (e) {
    var entry = el("div", "entry"), head = el("button", "entry-head"), tray = el("div", "tray"), inner = el("div", "tray-in"), body = el("div", "entry-body");
    head.type = "button"; head.setAttribute("aria-expanded", "false"); head.setAttribute("aria-controls", "log-" + e.id);
    head.appendChild(el("span", "entry-title", e.title));
    var tags = el("span", "nametags");
    e.names.forEach(function (n, i) {
      if (i) tags.appendChild(el("span", "arrow", "→"));
      var t = el("span", "nametag" + (n.current ? " now" : " old"), n.name); t.title = n.note || "";
      tags.appendChild(t);
    });
    head.appendChild(tags);
    var ol = el("ol", "timeline");
    e.events.forEach(function (ev) { var li = el("li"); li.appendChild(el("time", "", ev.when)); li.appendChild(el("span", "", ev.text)); ol.appendChild(li); });
    body.appendChild(ol);
    if (e.href) body.appendChild(link("Open it", e.href));
    inner.appendChild(body); tray.appendChild(inner); tray.id = "log-" + e.id; inner.inert = true;
    head.addEventListener("click", function () {
      var open = !entry.classList.contains("open");
      entry.classList.toggle("open", open); head.setAttribute("aria-expanded", String(open)); inner.inert = !open;
      Sfx.play(open ? "scribble" : "page");
    });
    head.addEventListener("pointerenter", function () { Sfx.play("ratchet"); });
    entry.appendChild(head); entry.appendChild(tray); log.appendChild(entry);
  });

  /* ---------- the shelf ---------- */
  var shelf = $("#builds");
  G.builds.forEach(function (p) {
    var a = el("a", "build"); a.href = p.href;
    a.appendChild(el("b", "", p.name)); a.appendChild(el("span", "", p.note)); a.appendChild(el("em", "", "Open the page →"));
    a.addEventListener("click", function () { Sfx.play("click"); });
    shelf.appendChild(a);
  });

  /* ---------- dust in the light ---------- */
  var beam = $("#beam");
  if (!reduce) {
    for (var i = 0; i < 38; i++) {
      var m = el("i", "mote");
      m.style.left = (28 + Math.random() * 44) + "%"; m.style.top = (Math.random() * 30) + "px";
      m.style.setProperty("--s", (1.5 + Math.random() * 3) + "px"); m.style.setProperty("--d", (10 + Math.random() * 14) + "s");
      m.style.setProperty("--w", (-Math.random() * 20) + "s"); m.style.setProperty("--x", (Math.random() * 90 - 45) + "px");
      beam.appendChild(m);
    }
  }

  /* ---------- welding sparks ---------- */
  var cv = $("#sparks"), cx = cv.getContext("2d"), parts = [], running = false, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function fit() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  fit(); addEventListener("resize", fit);
  function spark(x, y, n) {
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, v = 2 + Math.random() * 6;
      parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5 + Math.random() * 0.7, age: 0 });
    }
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }
  var last = 0;
  function frame(now) {
    var dt = Math.min((now - last) / 1000, 0.05); last = now;
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (p) { return (p.age += dt) < p.life; });
    parts.forEach(function (p) {
      p.vy += 18 * dt; p.x += p.vx; p.y += p.vy;
      var t = 1 - p.age / p.life;
      cx.strokeStyle = "rgba(255," + Math.round(120 + 120 * t) + "," + Math.round(40 * t) + "," + t + ")";
      cx.lineWidth = 2 * t + 0.5; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(p.x - p.vx * 1.4, p.y - p.vy * 1.4); cx.stroke();
    });
    if (parts.length) requestAnimationFrame(frame); else { running = false; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  $("#sign").addEventListener("click", function (e) {
    var r = e.currentTarget.getBoundingClientRect();
    if (!reduce) spark(r.left + r.width / 2, r.top + r.height * 0.55, 70);
    Sfx.play("spark");
  });

  /* ---------- the door and the lights ---------- */
  var door = $("#door"), dark = $("#dark"), seen = false;
  try { seen = sessionStorage.getItem("garage-door") === "1"; } catch (e) { /* storage blocked */ }
  function lightsOn(flicker) {
    document.body.classList.remove("door-closed");
    if (!flicker || reduce) { dark.style.transition = "none"; dark.style.opacity = "0"; return; }
    Sfx.play("lights");
    [[0, 0.55], [90, 1], [200, 0.35], [320, 1], [520, 0.2], [600, 0.8], [760, 0]].forEach(function (s) {
      setTimeout(function () { dark.style.opacity = String(s[1]); }, s[0]);
    });
  }
  if (location.hash === "#nodoor" || reduce || seen) {
    door.hidden = true; lightsOn(false);
  } else {
    $("#open-door").focus({ preventScroll: true });
    $("#open-door").addEventListener("click", function () {
      try { sessionStorage.setItem("garage-door", "1"); } catch (e) { /* ignore */ }
      Sfx.play("door"); door.classList.add("open"); door.setAttribute("aria-hidden", "true");
      setTimeout(function () { lightsOn(true); }, 1500);
      setTimeout(function () { door.hidden = true; $("#main").focus({ preventScroll: true }); }, 2300);
    });
  }
})();
