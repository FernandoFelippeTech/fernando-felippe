# Skills and Projects Visual Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Skills denser and Projects more architectural while preserving all approved content and behavior.

**Architecture:** Change only Skills markup and Projects decoration in `index.html`, with their CSS in existing modular files. Use inline SVG plus CSS; no JavaScript changes.

**Tech Stack:** HTML5, modular CSS, inline SVG, JavaScript ES modules, node:test.

**Spec:** `docs/superpowers/specs/2026-08-30-skills-projects-visual-revision-design.md`

## Global Constraints

- Stay on `redesign-ai-engineer`; do not commit, push, merge, switch branches, or alter Pages.
- Do not alter Header, Hero, About, Contact, Footer, terminal copy, or terminal behavior.
- Add no skills, dependency, library, Canvas, or new JavaScript.

---

### Task 1: Add the revised contract

**Files:** Modify `tests/portfolio.test.mjs`.

- [ ] Assert exact Skills categories/items, four decorative SVG icons, compact card hooks, and microgrids.
- [ ] Assert the isometric scene hooks while preserving terminal/module assertions.
- [ ] Run `npm.cmd test` and confirm expected failures.

### Task 2: Implement Skills cards

**Files:** Modify `index.html` and `css/sections.css`.

- [ ] Add one hidden decorative inline SVG and unique microgrid variant to each existing card.
- [ ] Recompose cards horizontally and reduce unused height without changing content.
- [ ] Preserve `.system-card`, 2x2 desktop layout, and one-column mobile layout.

### Task 3: Implement Projects scene and responsive motion

**Files:** Modify `index.html`, `css/sections.css`, `css/motion.css`, and `css/responsive.css`.

- [ ] Replace only `.project-network` with a fading SVG/CSS isometric system.
- [ ] Animate selected lines/nodes, never the whole structure.
- [ ] Simplify below 960/720/480px and remain static for reduced motion.

### Task 4: Verify

- [ ] Run `npm.cmd test`, `npm.cmd run validate`, and `git diff --check`.
- [ ] Review status/stat and report without integration actions.
