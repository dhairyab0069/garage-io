/* The four global symbol controls: Sound, Motion, Effects, Quiet everything.
   Loaded in <head> so html[data-motion] and html[data-fx] are set before first paint.
   Defaults are ON. Motion starts off only when the system asks for reduced motion (then it stays off).
   Choices are kept under the versioned keys garage2-sound, garage2-motion, garage2-fx; the page works with storage blocked.
   Other scripts read window.GCTL.state and listen for the "ctlchange" event on window. */
(function () {
  "use strict";
  var P = "garage2", root = document.documentElement;
  var reduced = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var NAMES = { sound: "Sound", motion: "Motion", fx: "Effects" };
  function get(n) { try { return localStorage.getItem(P + "-" + n); } catch (e) { return null; } }
  function put(n, v) { try { localStorage.setItem(P + "-" + n, v ? "on" : "off"); } catch (e) { /* storage blocked: fine */ } }
  var state = { sound: get("sound") !== "off", motion: reduced ? false : get("motion") !== "off", fx: get("fx") !== "off" };
  var prev = null;

  function paint() {
    [].forEach.call(document.querySelectorAll("[data-ctl]"), function (b) {
      var k = b.getAttribute("data-ctl");
      if (k === "quiet") { b.setAttribute("aria-pressed", String(!state.sound && !state.motion && !state.fx)); return; }
      var on = state[k], n = NAMES[k];
      b.setAttribute("aria-pressed", String(on));
      b.setAttribute("aria-label", n + (on ? " on" : " off"));
      b.title = n + (on ? " on. Press to turn off." : " off. Press to turn on.") + (k === "motion" && reduced ? " Your system asks for reduced motion, so motion stays off." : "");
    });
  }
  function apply(persist) {
    root.setAttribute("data-motion", state.motion ? "on" : "off");
    root.setAttribute("data-fx", state.fx ? "on" : "off");
    if (persist) Object.keys(NAMES).forEach(function (k) { put(k, state[k]); });
    paint();
    try { window.dispatchEvent(new CustomEvent("ctlchange", { detail: { sound: state.sound, motion: state.motion, fx: state.fx } })); } catch (e) { /* old browser */ }
  }
  function say(m) { var l = document.getElementById("ctl-live"); if (l) l.textContent = m; }

  function press(k) {
    if (k === "quiet") {
      var all = !state.sound && !state.motion && !state.fx;
      if (!all) { prev = { sound: state.sound, motion: state.motion, fx: state.fx }; state = { sound: false, motion: false, fx: false }; }
      else { var p = prev && (prev.sound || prev.motion || prev.fx) ? prev : { sound: true, motion: true, fx: true };
        state = { sound: p.sound, motion: reduced ? false : p.motion, fx: p.fx }; prev = null; }
      apply(true);
      say(state.sound || state.motion || state.fx ? "Sound, motion and effects are back." : "Everything is quiet: sound, motion and effects are off.");
      if (state.sound && window.Sfx) window.Sfx.play("on");
      return;
    }
    if (k === "motion" && reduced) { say("Your system asks for reduced motion, so motion stays off."); return; }
    state[k] = !state[k]; apply(true);
    say(NAMES[k] + (state[k] ? " on." : " off."));
    if (window.Sfx && state.sound && state[k]) window.Sfx.play("on");
  }

  window.GCTL = { get state() { return state; }, get motion() { return state.motion; }, get fx() { return state.fx; }, get sound() { return state.sound; } };
  apply(false);

  function mount() {
    [].forEach.call(document.querySelectorAll("[data-ctl]"), function (b) {
      b.addEventListener("click", function (e) { e.stopPropagation(); press(b.getAttribute("data-ctl")); });
    });
    paint();
    setTimeout(function () { root.classList.add("ctl-ready"); }, 80);     // no fade on the first paint of a saved "off"
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
