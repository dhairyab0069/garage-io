# The Garage: design

Keep this file current: every change gets a line under "Decisions and trade-offs".

## Purpose
A project page for the small tools, half-finished experiments and class projects that live next to Dhairya Bhatia's bigger builds, for anyone following the work (classmates, reviewers, curious visitors). It answers "what else has he made?" in a way that is fun to browse but quick to scan. Project type: portfolio / project index.

## Theme choice and why
Theme: a workshop. You arrive at a closed roller door; opening it flickers a tube light on over a concrete wall, a pegboard of hung tools, a steel tool chest, a locked toolbox, a logbook and a shelf of bigger builds. Chosen because the content is a pile of small things, and "things hung on a wall and filed in drawers" is the honest way to show a pile: each object is a real button that opens a real sheet. Dark is the original lit-up workshop; light is a daylight workshop (bright concrete, warm wood, the same steel door), designed rather than inverted. Type is a system stack only: Impact-style stencil for display, system sans for body, system mono for labels. No web fonts.

## Tokens
Defined once at the top of `assets/garage.css`; components read roles.

| Token | Dark | Light |
|---|---|---|
| `--wall` / `--wall-2` / `--floor` | `#26292d` / `#2f3338` / `#17181a` | `#dcd9d0` / `#e7e4db` / `#bdb9ad` |
| `--ink` / `--muted` | `#ece7d8` / `#a8a699` | `#1d1f22` / `#4a4840` |
| `--yellow` (fill only) | `#f2b705` | same |
| `--link` / `--focus` | `#f2b705` / `#f2b705` | `#7a3b00` / `#1a3fa0` |
| `--peg`, `--peg-a`, `--peg-frame` | warm wood | lighter wood |
| `--steel`, `--steel-mid`, `--steel-dark` | grey steel | same |
| `--snd-bg` / `--snd-ink` (the control buttons) | `#33383d` / `#ece7d8` | `#f3efe2` / `#1d1a14` |
| `--spark-core`, `--spark-edge`, `--spark-w` | `255,240,40` / `255,120,0` / 2 | `255,170,0` / `200,60,0` / 2.8 |
| `--dark-vignette` | heavy vignette (lights off) | light daylight veil |

Yellow stays a fill colour; on light, text and rings that were yellow use deep brown and blue so they keep 4.5:1 on concrete. Text pairs are at least 4.5:1 in both sets.

## Theme modes (light, dark, auto)
Shared protocol for all of the owner's pages (same origin): localStorage key `theme` = `light` | `dark` | `auto` (absent = auto). An inline script in `<head>` sets `data-theme-mode` and `data-theme` before first paint. Tokens live under `:root, :root[data-theme="dark"]` and `:root[data-theme="light"]` with a `prefers-color-scheme` fallback for no-JS. The three-way radiogroup is on the door and in the top bar. `assets/theme.js` dispatches `themechange` (the welding sparks re-read their colours), listens to `storage` so other tabs and pages follow live, follows the system in auto, and animates the change as a View Transition circle reveal (crossfade fallback) with a soft sound cue. Instant when Motion is off.

## The four symbol controls
Sound, Motion, Effects and Quiet everything: icon-only inline SVG buttons (24 px viewBox, stroke 1.8, round caps), each a real `<button>` with `aria-pressed`, an `aria-label` that states the state ("Sound on"), a `title`, a 44 px target and a visible focus ring. State is shown by glyph and fill, not colour alone: Sound is a speaker (waves on, slash off), Motion is flowing waves (pause bars off), Effects is a sparkle (a four-point star plus two small sparkles on, the star with a slash off), Quiet everything is a circle with a bar. They never share a shape with the theme sun and moon. They appear twice, on the door (replacing the old text Sound button) and in the top bar, and wrap onto a second row on a phone (icons only).
- Defaults: all three ON. Motion starts off only when the system asks for reduced motion, and then stays off (the button explains why).
- Storage: `garage2-sound`, `garage2-motion`, `garage2-fx` (versioned so the old `garage-sound` "off" cannot carry over), plus `garage2-door` in sessionStorage (door seen this tab). Every read and write is in try/catch; the page works with storage blocked.
- Quiet everything turns all three off; pressed again, it restores exactly the previous state.
- Logic is in `assets/controls.js` (loaded in `<head>`, so `html[data-motion]` and `html[data-fx]` are set before first paint). Other scripts read `window.GCTL.state` and listen for `ctlchange` on `window`.

## Motion spec
- Personality: heavy, physical, mechanical. A steel door, a swinging hung tool, a drawer on runners.
- Door: 2.1 s roller-door lift (CSS transform), then the tube light flickers on (seven quick opacity steps over 760 ms, once, softened vignette rather than full-screen flashes; it is the one place the 3-flashes-per-second guideline is stretched, kept because it is the flicker of a real tube and plays once per tab, and Motion off or reduced removes it) before the vignette lifts. Plays once per tab; skipped for `#nodoor`, for reduced motion and after the first visit in a tab.
- Hanging tools swing on hover (rotate and lift, a springy 350 ms), drawers and logbook trays open with a 400 ms grid-row transition, the details sheet slides in (400 ms), the padlock rattles (500 ms).
- Ambient: a tube-light hum (a slow 4 s opacity dip), 38 dust motes drifting down the light beam (CSS transform loops), and welding sparks on one canvas (a requestAnimationFrame loop that exists only while sparks are alive, at most 70 at a time).
- Gate: Motion on AND the system not reduced. Otherwise `html[data-motion="off"]` (and `@media (prefers-reduced-motion)`) sets every animation to 0 s and every transition to none, so everything lands in its final state: the door is simply gone and the lights are on at once, the flicker is skipped, the dust is hidden, the sparks do not spawn and a running spray is cleared. JS follows the same gate through `window.GCTL.motion`. The View Transition for the theme is also instant.

## Effects spec
Decorative things the Effects control switches (they can be off without losing any content): the dust motes in the light beam, the welding sparks (visual only; the sound belongs to Sound), the hover swing of a hung tool, and the lamp hum. Scoped under `html[data-fx="off"]` in CSS and `window.GCTL.fx` in JS. Effects off with Motion on keeps the door, drawers and sheet animations; Motion off wins over Effects.

## Sound spec
- Palette: metal. All synthesized with Web Audio (filtered noise, sine partials for struck steel, a low sawtooth for the motor); no files, no requests. Master gain 0.3 through a compressor; voice cap 90; the hover ratchet is rate limited to one per 110 ms.
- Cues: door (motor, rattling slats, a bump at the top), lights (a tube catching, then a hum), take and put (a tool lifted off its hook and returned), sheet, open and shut (a drawer on runners), lock (a padlock rattled), spark, scribble (a pen striking out an old name), page, click (a heavy switch), ratchet (hover), themeLight and themeDark, on.
- Unlock: the audio context is created and resumed on the first pointer, key or touch (browsers keep audio locked until a gesture). So the door sound plays when the first click on "Open the garage" happens. Turning Sound on from its button unlocks at once.
- Sound is on by default and the Sound symbol mutes it. Nothing plays while the tab is hidden. Every cue accompanies a visible change.

## Content model: data-driven
Everything the page shows comes from `assets/data.js` (`window.GARAGE`); `assets/app.js` draws it. Adding a project is a data edit.
- Pegboard: `tools[]`: `id`, `name`, `icon` (the `<symbol>` id of an SVG outline in `index.html`), `status`, `year`, `summary`, `detail`, `tags[]`, `links[]`. Each becomes a hook, a tag and a details sheet. A tool that is not published has no links.
- Drawers: `drawers[]` (the tool chest): a `label` and `items[]` of class projects with `name`, `note`, `href`. A drawer opens like a runner-mounted tray.
- Locked toolbox: `locked[]`: exactly `id`, `name`, `note`. No link of any kind, on purpose.
- Logbook: `logbook[]`: projects that changed names or homes, with `names[]` (exactly one `current`), and dated `events[]`. An old name is struck out and the timeline lists each move.
- Shelf: `builds[]`: bigger projects with a page of their own.

### Privacy rule
Private or under-review projects are never linked, named or described beyond what the locked toolbox shows. The locked toolbox entries carry only a name and a short note (no repo, no URL). `tests/data.test.js` enforces this: locked entries may have no extra fields, no link points at a private repository, and private project names do not appear anywhere in the page or the data except the locked toolbox. Add a new private project to `locked[]` only; never to a drawer, tool or build.

## Interaction inventory
| Where | Interaction | Feedback (motion, sound) |
|---|---|---|
| Door | Open the garage, controls, theme | door lifts, lights flicker, door and lights cues |
| Top bar | section links, four controls, theme | smooth scroll, controls announce state, click and on cues |
| Sign | press | welding sparks, spark cue |
| Pegboard | hover, press a tool | tool swings, ratchet; sheet slides in, take and sheet cues, Esc or click away puts it back |
| Tool chest | open a drawer | tray rolls out, open and shut cues |
| Locked toolbox | press | padlock rattles, note appears, lock cue |
| Logbook | open an entry | tray opens, old names struck out, scribble and page cues |
| Shelf | open a build page | click cue |

## Accessibility notes
- Contrast at least 4.5:1 in both modes; focus rings 3 px (`--focus`); state never by colour alone.
- Keyboard: skip link, every tool, drawer and lock is a real button with `aria-expanded` where it opens something, Esc puts the tool back, closed trays are `inert`, the theme group uses arrow keys, focus moves to the door button and then to the main content.
- Reduced motion: the system setting starts Motion off, the door is skipped; the Motion button explains why it cannot be turned on.
- Control changes are announced through a polite live region. `<noscript>` explains that the garage needs JavaScript and links to GitHub.
- Honest labelling: statuses ("Work in progress") are shown as they are.

## No external requests
No web fonts, CDN, analytics or remote images (the only `https` links are outbound project links the visitor chooses to follow, and the canonical and Open Graph tags).

## Decisions and trade-offs
| Date | Decision | Why |
|---|---|---|
| 2026-11-04 | Joined the shared design language: four symbol controls replace the text Sound button, defaults on | owner preference; `garage-sound` (off) is ignored in favour of `garage2-*` |
| 2026-11-04 | Motes are always built and hidden by CSS | one gate (CSS) instead of a second JS path; 38 tiny elements are cheap |
| 2026-11-04 | Motion off removes the door instead of animating it faster | the door is a pure flourish; an instant open respects the intent |
| 2026-11-04 | Theme radios use `data-theme-mode` | the shared convention across the owner's pages |
| 2026-11-04 | Top bar wraps to two rows at 390 px | seven 44 px targets do not fit one row; icons only, no hidden controls |

## How to extend
- A project: edit `assets/data.js` (see Content model). A new tool icon: add a `<symbol>` to the sprite in `index.html`.
- A new animation: let it end in its final state when `html[data-motion="off"]` applies, or check `window.GCTL.motion`. A new decoration: scope it under `html[data-fx="on"]` or check `window.GCTL.fx`.
- A new sound: add a function to `FX` in `assets/sound.js` and call `Sfx.play("name")`; keep gains small.
- Tokens: change the top of `assets/garage.css`; never hard-code a colour in a component.
- Tests: `node tests/data.test.js`; audit: `node ~/.claude/skills/dynamic-web-design/scripts/check_site.js .`.
