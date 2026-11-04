# The Garage

The project page for my small tools, experiments and class projects:
**<https://dhairyab0069.github.io/garage-io/>**. The bigger builds have pages of their own
(Himawari, Abiogenesis, Calendar, BIOT 6900, Atlas-Mobile, FocusLock, LucasCheck, the ML projects and the macOS tools: see the shelf).

It is a static site: HTML, CSS and vanilla JavaScript, no build step, no libraries, no fonts, no trackers and no external
requests. You arrive at a closed roller door; open it and the tube light flickers on over:

- **the pegboard**: small public tools and experiments, each hung on a hook. Press one to take it off the wall and read its sheet;
- **the tool chest**: class projects, filed by drawer;
- **the locked toolbox**: private projects, described but never linked;
- **the logbook**: the history of some projects, with their old names struck out and a dated timeline;
- **the shelf**: the bigger builds.

Add a project by editing `assets/data.js`; nothing else needs to change.

## Sound

The Sound switch (on the door and in the top bar, off by default, remembered in `localStorage`) turns on workshop sounds made live
with the Web Audio API: the door's motor and rattling slats, a fluorescent tube catching, a tool lifted off its hook, a drawer on
its runners, a padlock rattled, welding sparks. There are no audio files. Nothing plays while the tab is hidden.

## Motion and accessibility

The door, the swing of a hung tool, the flicker and the dust are skipped when the system asks for reduced motion. Everything is a
real button or link with a focus ring, drawers and locks expose `aria-expanded`, and Esc puts the tool back. Add `#nodoor` to the
URL to skip the door.

## Light, dark and auto

The page follows one setting shared across all of dhairyab0069.github.io: `localStorage.theme` is `light`, `dark` or `auto`
(absent means auto, following the system). The three-way switch sits on the door and in the top bar; a change made on any other
page or tab applies here live. Dark is the original lit-up workshop. Light is a daylight workshop: bright concrete, warm wood
pegboard, the same steel door, and a gentle daylight in place of the dark vignette, so the lights still flicker on and end bright.
The welding sparks re-read their colours from the theme tokens. An inline script in `<head>` sets the theme before first paint; the
change plays a short circle reveal and a soft sound cue (when sound is on), and is instant under reduced motion. Code: `assets/theme.js`.

## Run and test

```bash
python3 -m http.server 8000   # then open http://localhost:8000/
node tests/data.test.js       # data checks, including that nothing private is linked
```

## Layout

| File | What it is |
|---|---|
| `index.html` | the page, with the SVG tool icons |
| `assets/data.js` | every project the garage shows |
| `assets/app.js` | drawing, the door, lights, dust, sparks, the sheet |
| `assets/sound.js` | the synthesized sounds |
| `assets/theme.js` | light / dark / auto switch, shared across the owner's sites |
| `assets/garage.css` | styles |
