# AI Engineer Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing static portfolio around an accurate AI Engineer specialization while preserving its architecture, accessibility, and GitHub Pages behavior.

**Architecture:** Keep `index.html` as the semantic source, the existing five-part CSS import chain, and the existing ES-module boundaries. Update behavior only inside its current responsible module and keep every local URL relative.

**Tech Stack:** HTML5, modular CSS, JavaScript ES modules, Canvas 2D, Node `node:test`, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-30-ai-engineer-redesign-design.md`

## Global Constraints

- Work only on `redesign-ai-engineer`; do not commit, push, merge, switch to `main`, or change GitHub Pages.
- Do not introduce frameworks, bundlers, or dependencies.
- Preserve `images/Foto.jpg`, `images/ff-mark.svg`, progressive enhancement, accessibility, and `prefers-reduced-motion`.
- Do not invent projects, professional experience, skills, URLs, or a CV PDF.

---

### Task 1: Replace the portfolio contract

**Files:**
- Modify: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: the approved redesign specification.
- Produces: failing tests for the new semantic, visual, navigation, preloader, and Pages-safe URL contract.

- [ ] Replace legacy content assertions with the AI Engineer positioning and coming-soon project state.
- [ ] Add assertions for the absent Process section and paused projects.
- [ ] Add assertions for the relative CV path, preserved photo, contacts, responsive structure, reduced motion, Canvas, and preloader lifecycle.
- [ ] Run `npm test` and confirm failures are caused by missing redesign behavior.

### Task 2: Implement semantic content and modular visual system

**Files:**
- Modify: `index.html`
- Modify: `css/base.css`
- Modify: `css/components.css`
- Modify: `css/sections.css`
- Modify: `css/motion.css`
- Modify: `css/responsive.css`

**Interfaces:**
- Consumes: section IDs used by navigation and `[data-reveal]` used by reveal behavior.
- Produces: semantic page markup, stable anchors, `.system-card` lighting targets, and accessible responsive layouts.

- [ ] Replace header, hero, about, skills, projects, contact, and footer markup while retaining one H1 and decorative ARIA treatment.
- [ ] Remove Process and both paused projects without leaving anchor or selector dependencies.
- [ ] Rebuild tokens, components, sections, motion, and breakpoints around the approved design.
- [ ] Keep local references relative and preserve the photo and mark unchanged.
- [ ] Run `npm test` and address only markup/style contract failures.

### Task 3: Correct interaction behavior

**Files:**
- Modify: `js/main.js`
- Modify: `js/navigation.js`
- Modify: `js/reveal.js`
- Modify: `js/technical-canvas.js`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: `.menu-toggle`, `#mobile-menu`, section IDs, `[data-reveal]`, `#preloader`, `#technical-canvas`, and `.system-card`.
- Produces: cleanup-capable initializers and a nonblocking preloader lifecycle.

- [ ] Make card lighting target the new reusable card class and remain fine-pointer-only.
- [ ] Preserve accessible navigation state with the five-section structure.
- [ ] Implement immediate-complete, load-driven, and short-fallback preloader exit behavior.
- [ ] Evolve Canvas colors/motion only within existing performance caps.
- [ ] Run `npm test` until all behavior tests pass.

### Task 4: Align documentation and validate

**Files:**
- Modify: `README.md`
- Modify: `docs/design-decisions.md`
- Modify: `TODO.md`

**Interfaces:**
- Consumes: the completed implementation.
- Produces: accurate setup, architecture, design, and missing-CV documentation.

- [ ] Remove claims about paused projects, Process, and nonexistent metadata.
- [ ] Document AI Engineer positioning and the missing local CV PDF.
- [ ] Run `npm test` and confirm zero failures.
- [ ] Run `npm run validate` and confirm tests plus local-link validation pass, with the intentional missing CV handled without fabricating it.
- [ ] Run `git status`, `git diff --stat`, and review `git diff` without committing or pushing.
