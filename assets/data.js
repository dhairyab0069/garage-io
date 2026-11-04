/* What is in the garage. Everything the page shows comes from here, so adding a project is a data edit.
   - tools:   small public projects, hung on the pegboard (icon names are the <symbol> ids in index.html)
   - drawers: class projects, filed in the tool chest
   - locked:  private projects, shown by name and description only (no links, on purpose)
   - builds:  bigger projects that have their own page, on the shelf above the bench */
window.GARAGE = {
  tools: [
    { id: "step-extracter-cad", name: "CAD feature extractor", icon: "calipers", status: "Work in progress", year: 2025,
      summary: "Measures a CAD model: its volumes, areas, bounding box and features.",
      detail: "A Python tool that reads STEP, IGES and STL files with pythonOCC and pulls out geometric features and dimensions, aiming at automated analysis for engineering and manufacturing checks.",
      tags: ["Python", "pythonOCC", "CAD", "Geometry"],
      links: [{ label: "Repo", href: "https://github.com/dhairyab0069/step-extracter-CAD" }] },
    { id: "cv-tool", name: "Interactive image editor", icon: "brush", status: "Work in progress", year: 2023,
      summary: "MATLAB pipelines, PyTorch models and a chat interface, behind one web page.",
      detail: "An image editing platform that joins classic MATLAB image processing, PyTorch deep learning models and a GPT-powered conversational interface with a web front end, so you can ask for an edit in plain words.",
      tags: ["Python", "PyTorch", "MATLAB", "Computer vision"],
      links: [{ label: "Repo", href: "https://github.com/dhairyab0069/pytorch-matlab-integrated-CV-tool" }] },
    { id: "oblivion", name: "Data extraction AI", icon: "funnel", status: "Work in progress", year: 2025,
      summary: "Pulls structured data out of messy industrial documents.",
      detail: "A working-title system that extracts, processes and searches data from structured and unstructured sources, aimed at industrial and technical documents: embeddings, retrieval and scalable processing.",
      tags: ["Python", "Embeddings", "Retrieval", "Documents"],
      links: [{ label: "Repo", href: "https://github.com/dhairyab0069/oblivion" }] },
    { id: "r-mipro", name: "r-MIPRO", icon: "wrench", status: "Work in progress", year: 2025,
      summary: "Spends a limited prompt-tuning budget where it helps most.",
      detail: "Resource-adaptive prompt optimization for multi-agent LLM systems. The question: how should optimization trials be shared out across modules or agents when cost, latency and budget are limited?",
      tags: ["Python", "LLMs", "Prompt optimization", "DSPy"],
      links: [{ label: "Repo", href: "https://github.com/dhairyab0069/miprovsrmipro" }] },
    { id: "manifold", name: "Manifold search", icon: "compass", status: "Research project", year: 2026,
      summary: "Fast shortest paths over curved surfaces.",
      detail: "A two-level search over sphere and torus meshes that routes across a coarse graph of patches, then refines, and is compared with Dijkstra and A* for speed and accuracy. A CS 5800 algorithms project and my own research. Planned next: more surfaces and real meshes, GPU-scale runs, and learned partitions and heuristics.",
      tags: ["Python", "Algorithms", "Geometry", "Research"],
      links: [{ label: "Repo", href: "https://github.com/dhairyab0069/manifold-search" }] },
    { id: "depdeck", name: "DepDeck", icon: "box", status: "Works, build from source", year: 2026,
      summary: "A menu bar app that keeps your Homebrew, npm and cargo packages up to date.",
      detail: "A macOS menu bar app for managing command-line tools and dependencies. A popover with five tabs (Installed, Updates, Issues, Search, Settings) lists packages from Homebrew, npm and cargo, updates or uninstalls them one by one or all at once, and shows a badge when something is out of date. There is no release yet, so you build it from source. The demo page recreates it in the browser.",
      tags: ["Swift", "SwiftUI", "macOS", "Homebrew", "npm", "cargo"],
      links: [{ label: "Repo", href: "https://github.com/dhairyab0069/DepDeck" }, { label: "Try the demo", href: "https://dhairyab0069.github.io/macos-tools-io/" }] },
    { id: "desktop-shell", name: "Desktop Shell", icon: "taskbar", status: "Works, build from source", year: 2026,
      summary: "A Windows-XP-style taskbar and Start menu, with iOS-style folders and widgets, for macOS.",
      detail: "A macOS desktop shell: an XP-style taskbar with a Start menu, iOS-style desktop folders, Aero-style widgets you can dock to any edge, a window tiling rule that respects the reserved strips, and a desktopctl command line. There is no release yet, so you build it from source. The demo page recreates it in the browser.",
      tags: ["Swift", "macOS", "Window management", "Desktop"],
      links: [{ label: "Repo", href: "https://github.com/dhairyab0069/desktop-shell-mac" }, { label: "Try the demo", href: "https://dhairyab0069.github.io/macos-tools-io/" }] },
    { id: "web-design-skill", name: "Web design skill", icon: "wand", status: "In daily use", year: 2026,
      summary: "A Claude Code skill that builds animated, sound-rich project pages from a kit of themes, and remembers every customisation.",
      detail: "A skill for Claude Code that I use to make my project pages. It holds a small kit (design tokens, a single animation loop, page transitions, a synthesized sound engine with six palettes, symbol controls for sound, motion and effects, and one light, dark and auto setting shared by every page), a registry of twelve themes and my past projects, a scaffold that builds a new page from a theme and a project type, and an audit that checks it. Every page it makes has sound, motion and transitions, even a plain one, and it writes down the design decisions as it goes. It is not published.",
      tags: ["Claude Code", "JavaScript", "Web Audio", "Design systems"],
      links: [] },
    { id: "murmur", name: "Murmur design language", icon: "swatch", status: "In daily use", year: 2026,
      summary: "The design language behind my project pages: tokens, motion, sound and controls, with a live style guide.",
      detail: "Murmur is the design language my pages share: seven principles (alive by default, hushable always, honest, plain, one system with many materials, two moods with one setting, self-contained and documented), design tokens for twelve themes in light and dark, a motion language, a sound language with playable cues, the symbol controls, and the single light, dark and auto setting every page follows. The style guide is a page of its own, and it audits how closely each of my pages follows the language.",
      tags: ["Design systems", "Design tokens", "Motion", "Sound design", "Accessibility"],
      links: [{ label: "Style guide", href: "https://dhairyab0069.github.io/design-language/" }, { label: "Repo", href: "https://github.com/dhairyab0069/design-language" }] },
    { id: "nextcube-terminal", name: "nextcube terminal", icon: "monitor", status: "Done", year: 2026,
      summary: "A pretend NeXTSTEP Unix shell with a five-flag CTF, in the browser.",
      detail: "About 100 commands on a pretend filesystem, with pipes, redirects, scripts and a hidden kernel dungeon, plus a five-flag reverse-engineering CTF. Plain HTML and ES modules, no build step. It is embedded in the portfolio's Workbench.",
      tags: ["JavaScript", "ES modules", "CTF", "Terminal"],
      links: [{ label: "Repo", href: "https://github.com/dhairyab0069/nextcube-terminal" }, { label: "Try it", href: "https://dhairyab0069.github.io/nextcube-terminal/" }] }
  ],
  drawers: [
    { id: "d-coursify", label: "Year-long project", items: [
      { name: "Coursify AI", note: "A Flask web app that helps teachers generate course content. Team project, UBC capstone, run in Docker.", href: "https://github.com/dhairyab0069/Coursify-AI" } ] },
    { id: "d-atlas", label: "Human-computer interaction", items: [
      { name: "Atlas (Java)", note: "A gym progress tracker, made by a team of five for COSC 341 at UBC Okanagan.", href: "https://github.com/dhairyab0069/Atlas" } ] },
    { id: "d-web", label: "Web programming", items: [
      { name: "Fighting-game discussion forum", note: "A forum site for fighting-game fans, in PHP, for COSC 360.", href: "https://github.com/dhairyab0069/StreetFighter_DiscussionForum" } ] },
    { id: "d-se", label: "Software engineering", items: [
      { name: "Q-Clicker", note: "A classroom-response web app built with a structured process, design patterns and tests, for COSC 310.", href: "https://github.com/dhairyab0069/Q-Clicker" } ] },
    { id: "d-pdp", label: "Programming design paradigms", items: [
      { name: "Calendar", note: "A multi-calendar scheduler in Java, built with a partner for CS 5010. It has its own page on the shelf.", href: "https://dhairyab0069.github.io/calendar-app-io/" } ] }
  ],
  logbook: [
    { id: "calendar", title: "Calendar", href: "https://dhairyab0069.github.io/calendar-app-io/",
      names: [{ name: "hw4-team-top", note: "the team repo" }, { name: "calendar-app", note: "its own repo" }, { name: "Calendar", current: true }],
      events: [
        { when: "Oct 2025", text: "Began as the team repository hw4-team-top for CS 5010, Programming Design Paradigms." },
        { when: "Jun 2026", text: "A repository of its own, calendar-app, was created for it." },
        { when: "Nov 2026", text: "The Rust port started with a plan and the model layer, the Java app was archived, and the project page went up." } ] },
    { id: "himawari", title: "Himawari", href: "https://dhairyab0069.github.io/himawari-io/",
      names: [{ name: "Hanabi", note: "the first name" }, { name: "Himawari", current: true, note: "向日葵, sunflower" }],
      events: [
        { when: "The start", text: "Called Hanabi, after Hanabi for GNOME, the live-wallpaper extension that inspired it." },
        { when: "Then", text: "Renamed Himawari, which is Japanese for sunflower. The repository was renamed too, and the old address still redirects." },
        { when: "27 Sep 2026", text: "Beta 1.0 was released." } ] },
    { id: "abiogenesis", title: "Abiogenesis", href: "https://dhairyab0069.github.io/abiogenesis-io/",
      names: [{ name: "Abiogenesis", current: true }],
      events: [
        { when: "May 2025", text: "First commit: a Java and JavaFX simulation of molecules and amino acid chains. Javadocs came three days later." },
        { when: "14 Oct 2026", text: "Ported to Rust with egui and shipped as one self-contained app." },
        { when: "Nov 2026", text: "Version 0.3.0 added the environment, protocells and self-copying RNA strands, on a six-stage roadmap." } ] },
    { id: "atlas", title: "Atlas", href: "https://dhairyab0069.github.io/atlas-mobile-io/",
      names: [{ name: "Atlas", note: "the Android original" }, { name: "Atlas-Mobile", current: true, note: "the native rewrite" }],
      events: [
        { when: "30 Nov 2022", text: "First commit: a gym progress tracker built by a team of five for COSC 341 at UBC Okanagan." },
        { when: "18 Oct 2026", text: "Rewritten as native apps: SwiftUI for iOS and Kotlin with Compose for Android." } ] },
    { id: "manifold", title: "Manifold search", href: "https://github.com/dhairyab0069/manifold-search",
      names: [{ name: "cs5800-project-manifold", note: "the course title" }, { name: "Manifold search", current: true }],
      events: [
        { when: "16 Jul 2026", text: "The repository was created for the CS 5800 algorithms project." },
        { when: "30 Jul 2026", text: "The notebook was uploaded." },
        { when: "Nov 2026", text: "Split into Part 1, the course exploration, and Part 2, my own research in computational geometry." } ] },
    { id: "nextcube-terminal", title: "nextcube terminal", href: "https://dhairyab0069.github.io/nextcube-terminal/",
      names: [{ name: "Workbench", note: "inside this portfolio" }, { name: "nextcube-terminal", current: true }],
      events: [
        { when: "The start", text: "Began as the Workbench terminal inside my portfolio site." },
        { when: "23 Sep 2026", text: "Split out into its own repository, nextcube-terminal, and embedded back into the portfolio." } ] }
  ],
  locked: [
    { id: "nextcube", name: "nextcube", note: "A NeXTSTEP-styled terminal emulator for macOS and Debian." },
    { id: "ml-course", name: "ML course", note: "A fill-in-the-code course in machine learning, deep learning, NLP, vision, GANs and graphs, with a VS Code coach." }
  ],
  builds: [
    { name: "Himawari", note: "A live wallpaper for macOS that turns into your music.", href: "https://dhairyab0069.github.io/himawari-io/" },
    { name: "Abiogenesis", note: "A Rust simulation of how life could start, from soup to self-copying RNA.", href: "https://dhairyab0069.github.io/abiogenesis-io/" },
    { name: "Calendar", note: "A multi-calendar scheduler, on a 1980s office desktop.", href: "https://dhairyab0069.github.io/calendar-app-io/" },
    { name: "Atlas-Mobile", note: "A gym tracker for iOS and Android, native on each, from one shared spec.", href: "https://dhairyab0069.github.io/atlas-mobile-io/" },
    { name: "FocusLock", note: "A focus timer that pauses when you wander. Try the simulator; the source is private.", href: "https://dhairyab0069.github.io/focuslock-io/" },
    { name: "LucasCheck", note: "A mock store with a working miniature, from a database course.", href: "https://dhairyab0069.github.io/lucascheck-io/" },
    { name: "ML projects", note: "ECG diagnosis and NYC taxi prediction, as a map with a hospital and a taxi stand.", href: "https://dhairyab0069.github.io/ml-projects-io/" },
    { name: "BIOT 6900 report", note: "Alzheimer's disease from genes to drug targets, written up like a medical report.", href: "https://dhairyab0069.github.io/biot6900-io/" }
  ]
};
