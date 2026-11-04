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
      summary: "Fast shortest paths over curved surfaces. A class project turned personal research.",
      detail: "It began as the CS 5800 algorithms project: a two-level search over sphere and torus meshes that routes across a coarse graph of patches, then refines, and is compared with Dijkstra and A* for speed and accuracy. It is now my own research project. Planned next: more surfaces and real meshes, GPU-scale runs, and learned partitions and heuristics.",
      tags: ["Python", "Algorithms", "Geometry", "Research"],
      links: [{ label: "Repo", href: "https://github.com/dhairyab0069/manifold-search" }] },
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
      { name: "Atlas (Java)", note: "The original gym progress tracker, made by a team of five for COSC 341 at UBC Okanagan.", href: "https://github.com/dhairyab0069/Atlas" } ] },
    { id: "d-web", label: "Web programming", items: [
      { name: "Fighting-game discussion forum", note: "A forum site for fighting-game fans, in PHP, for COSC 360.", href: "https://github.com/dhairyab0069/StreetFighter_DiscussionForum" } ] },
    { id: "d-se", label: "Software engineering", items: [
      { name: "Q-Clicker", note: "A classroom-response web app built with a structured process, design patterns and tests, for COSC 310.", href: "https://github.com/dhairyab0069/Q-Clicker" } ] },
    { id: "d-pdp", label: "Programming design paradigms", items: [
      { name: "Calendar", note: "A multi-calendar scheduler in Java, built with a partner for CS 5010. Has its own page on the shelf.", href: "https://dhairyab0069.github.io/calendar-app-io/" },
      { name: "Homework 4 team repo", note: "Homework 4, a Java team repository.", href: "https://github.com/dhairyab0069/hw4-team-top" } ] }
  ],
  locked: [
    { id: "focuslock", name: "FocusLock", note: "A minimal macOS focus timer. An LLM watchdog pauses the clock, browsers are filtered for social media, and there are emergency killswitches. Made to be ADHD-friendly." },
    { id: "nextcube", name: "nextcube", note: "A NeXTSTEP-styled terminal emulator for macOS and Debian." },
    { id: "ml-course", name: "ML course", note: "A fill-in-the-code course in machine learning, deep learning, NLP, vision, GANs and graphs, with a VS Code coach." }
  ],
  builds: [
    { name: "Himawari", note: "A live wallpaper for macOS that turns into your music.", href: "https://dhairyab0069.github.io/himawari-io/" },
    { name: "Abiogenesis", note: "A Rust simulation of how life could start, from soup to self-copying RNA.", href: "https://dhairyab0069.github.io/abiogenesis-io/" },
    { name: "Calendar", note: "A multi-calendar scheduler, on a 1980s office desktop.", href: "https://dhairyab0069.github.io/calendar-app-io/" },
    { name: "BIOT 6900 report", note: "Alzheimer's disease from genes to drug targets, written up like a medical report.", href: "https://dhairyab0069.github.io/biot6900-io/" }
  ]
};
