/* Garage sounds, off until the Sound switch is pressed. Everything is synthesized with the Web Audio API
   (noise, a few sine partials for metal, a low motor tone), so there are no audio files and no requests.
   Other scripts call Sfx.play("name"). Nothing plays while the tab is hidden. */
(function () {
  "use strict";
  var KEY = "garage-sound", MAX = 90;
  var on = false, ctx = null, master = null, noise = null, voices = 0, last = {};
  try { on = localStorage.getItem(KEY) === "1"; } catch (e) { /* storage blocked */ }

  function ensure() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ctx = new AC();
      var comp = ctx.createDynamicsCompressor();
      master = ctx.createGain(); master.gain.value = 0.3;
      master.connect(comp); comp.connect(ctx.destination);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      var d = noise.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { ctx = null; return false; }
    return true;
  }
  function ready() { return on && ctx && ctx.state === "running" && !document.hidden; }
  function gap(k, ms) { var n = performance.now(); if (n - (last[k] || 0) < ms) return true; last[k] = n; return false; }
  function R(a, b) { return a + Math.random() * (b - a); }

  /* a note: o = {f, to, type, gain, dur, at, attack} */
  function tone(o) {
    if (voices >= MAX) return;
    var t0 = ctx.currentTime + (o.at || 0), dur = o.dur || 0.1, osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(o.f, t0);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(o.gain || 0.05, t0 + (o.attack || 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(master);
    voices++; osc.onended = function () { voices--; };
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  /* filtered noise: o = {type, f, to, q, gain, dur, at, attack} */
  function hiss(o) {
    if (voices >= MAX) return;
    var t0 = ctx.currentTime + (o.at || 0), dur = o.dur || 0.1, src = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noise;
    fl.type = o.type || "bandpass"; fl.Q.value = o.q || 1;
    fl.frequency.setValueAtTime(o.f || 2000, t0);
    if (o.to) fl.frequency.exponentialRampToValueAtTime(o.to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(o.gain || 0.05, t0 + (o.attack || 0.003));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(fl); fl.connect(g); g.connect(master);
    voices++; src.onended = function () { voices--; };
    src.start(t0, Math.random() * 0.5); src.stop(t0 + dur + 0.05);
  }
  /* a struck piece of steel: three inharmonic partials that ring and die, plus the tick of the hit */
  function clink(at, f, gain) {
    tone({ at: at, f: f, dur: 0.28, gain: gain, attack: 0.001 });
    tone({ at: at, f: f * 2.76, dur: 0.14, gain: gain * 0.5, attack: 0.001 });
    tone({ at: at, f: f * 5.4, dur: 0.07, gain: gain * 0.25, attack: 0.001 });
    hiss({ at: at, type: "highpass", f: 5000, dur: 0.012, gain: gain * 0.6, attack: 0.001 });
  }
  function thump(at, gain, f) {
    hiss({ at: at, type: "lowpass", f: 300, q: 0.7, dur: 0.08, gain: gain, attack: 0.002 });
    tone({ at: at, f: f || 100, to: (f || 100) * 0.6, dur: 0.12, gain: gain * 0.6, attack: 0.002 });
  }

  var FX = {
    door: function () {                                  // a roller door going up: motor, rattling slats, a bump at the top
      thump(1.95, 0.1, 90);
      tone({ f: 55, to: 98, type: "sawtooth", dur: 1.9, gain: 0.035, attack: 0.25 });
      hiss({ type: "lowpass", f: 180, to: 320, q: 0.7, dur: 1.9, gain: 0.09, attack: 0.3 });
      for (var i = 0; i < 24; i++) {                     // slats rattling: one partial and a tick each, to stay light
        var t = R(0.05, 1.8);
        tone({ at: t, f: R(500, 1700), dur: 0.12, gain: R(0.008, 0.02), attack: 0.001 });
        hiss({ at: t, type: "highpass", f: 5000, dur: 0.012, gain: 0.012, attack: 0.001 });
      }
    },
    lights: function () {                                // a fluorescent tube catching: clicks, then a hum
      [0, 0.12, 0.2, 0.45, 0.52].forEach(function (t) { hiss({ at: t, type: "highpass", f: 3000, dur: 0.02, gain: 0.07, attack: 0.001 }); thump(t, 0.03, 160); });
      tone({ at: 0.55, f: 100, type: "sawtooth", dur: 0.9, gain: 0.012, attack: 0.1 });
      tone({ at: 0.55, f: 200, dur: 0.9, gain: 0.01, attack: 0.1 });
    },
    take: function () { clink(0, 3000, 0.05); thump(0.02, 0.05, 190); },            // a tool lifted off its hook
    put: function () { thump(0, 0.05, 170); clink(0.03, 2600, 0.035); },
    sheet: function () { hiss({ type: "bandpass", f: 2500, to: 4000, q: 0.6, dur: 0.14, gain: 0.05, attack: 0.02 }); thump(0.13, 0.03, 200); },
    open: function () {                                  // a drawer rolling out on runners, stopping at the end
      hiss({ type: "lowpass", f: 900, to: 300, q: 0.6, dur: 0.32, gain: 0.08, attack: 0.04 });
      for (var i = 0; i < 6; i++) clink(R(0, 0.3), R(900, 1500), 0.012);
      thump(0.32, 0.09, 110); clink(0.32, 1800, 0.03);
    },
    shut: function () {
      hiss({ type: "lowpass", f: 300, to: 900, q: 0.6, dur: 0.28, gain: 0.08, attack: 0.03 });
      thump(0.28, 0.13, 90);
    },
    lock: function () {                                  // a padlock rattled on its hasp
      for (var i = 0; i < 6; i++) clink(i * 0.055 + R(0, 0.02), R(1500, 2700), R(0.025, 0.05));
      hiss({ type: "bandpass", f: 4000, q: 2, dur: 0.3, gain: 0.02 });
    },
    spark: function () {                                 // welding sparks: a hiss and a spray of crackles
      hiss({ type: "highpass", f: 3000, dur: 0.45, gain: 0.05, attack: 0.01 });
      for (var i = 0; i < 24; i++) hiss({ at: R(0, 0.5), type: "bandpass", f: R(3000, 8000), q: 2, dur: R(0.004, 0.012), gain: R(0.03, 0.08), attack: 0.001 });
    },
    scribble: function () {                              // a pen striking out an old name, then a page turned
      for (var i = 0; i < 9; i++) hiss({ at: i * 0.035, type: "bandpass", f: R(2500, 5500), q: 1.5, dur: 0.05, gain: 0.035, attack: 0.004 });
      hiss({ at: 0.36, type: "highpass", f: 3000, to: 1500, dur: 0.14, gain: 0.05, attack: 0.02 });
    },
    page: function () { hiss({ type: "bandpass", f: 1300, to: 4800, q: 0.5, dur: 0.15, gain: 0.07, attack: 0.025 }); for (var i = 0; i < 8; i++) hiss({ at: R(0.02, 0.16), type: "highpass", f: R(2600, 7000), dur: 0.01, gain: 0.03, attack: 0.001 }); },
    click: function () { thump(0, 0.05, 150); clink(0.005, 2200, 0.02); },            // a heavy switch
    ratchet: function () { hiss({ type: "highpass", f: 4500, dur: 0.012, gain: 0.03, attack: 0.001 }); tone({ f: R(1700, 2100), dur: 0.012, gain: 0.02, attack: 0.001 }); },
    on: function () { clink(0, 2400, 0.05); clink(0.09, 3200, 0.05); }
  };

  function play(name, arg) {
    if (!ready() || !FX[name]) return;
    if (name === "ratchet" && gap("ratchet", 110)) return;
    try { FX[name](arg); } catch (e) { /* audio must never break the page */ }
  }
  function wake() { if (on && ensure() && ctx.state === "suspended") ctx.resume().catch(function () {}); }

  var buttons = [];
  function paint() { buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(on)); b.querySelector(".lbl").textContent = on ? "Sound on" : "Sound off"; }); }
  function save() { try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (e) { /* ignore */ } }
  function toggle() {
    if (on) { play("click"); on = false; save(); paint(); return; }
    if (!ensure()) { buttons.forEach(function (b) { b.querySelector(".lbl").textContent = "No audio here"; }); return; }
    on = true; save(); paint();
    ctx.resume().then(function () { play("on"); }).catch(function () {});
  }
  document.addEventListener("DOMContentLoaded", function () {
    buttons = [].slice.call(document.querySelectorAll("[data-sound-switch]"));
    buttons.forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); toggle(); }); });
    paint();
  });
  if (on) ["pointerdown", "keydown"].forEach(function (n) { addEventListener(n, wake, { once: true, capture: true }); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) wake(); });

  window.Sfx = { play: play, get on() { return on; } };
})();
