# AI Engineer Visual Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the existing AI Engineer redesign with the approved compact visual reference.

**Architecture:** Keep the current HTML/CSS modules and add one focused ES module for project-terminal typing. Use inline SVG and CSS procedural graphics without libraries or assets.

**Tech Stack:** HTML5, modular CSS, JavaScript ES modules, Canvas 2D, node:test.

**Spec:** `docs/superpowers/specs/2026-08-30-ai-engineer-visual-revision-design.md`

## Global Constraints

- Stay on `redesign-ai-engineer`; do not commit, push, merge, switch branches, or alter GitHub Pages.
- Preserve photo, mark, skills cards, contact URLs, accessibility, progressive enhancement, and reduced motion.
- Add no dependency, CDN icon library, framework, or bundler.

---

### Task 1: Define the revised contract

**Files:** Modify `tests/portfolio.test.mjs`.

- [ ] Add failing assertions for the code panel, compact About summaries, procedural project network, social icon links, and removed orbit labels.
- [ ] Add behavior tests for one-shot typing, fallback, and reduced motion.
- [ ] Run `npm.cmd test` and confirm expected failures.

### Task 2: Implement revised markup and styling

**Files:** Modify `index.html`, `css/components.css`, `css/sections.css`, `css/motion.css`, and `css/responsive.css`.

- [ ] Replace hero visual markup with the decorative code system.
- [ ] Compact About summaries with inline SVG icons.
- [ ] Replace the project construction and add terminal hooks.
- [ ] Replace contact/footer textual links with accessible inline SVG links.
- [ ] Preserve skills markup and system-card interaction.

### Task 3: Implement terminal behavior

**Files:** Create `js/project-terminal.js`; modify `js/main.js`; test in `tests/portfolio.test.mjs`.

- [ ] Export `initProjectTerminal(documentRef, windowRef, options)` with cleanup.
- [ ] Type once after intersection and reveal immediately for reduced motion or unsupported observers.
- [ ] Run the full test suite until green.

### Task 4: Verify and report

**Files:** Update documentation only if its claims become inaccurate.

- [ ] Run `npm.cmd test` and `npm.cmd run validate`.
- [ ] Run `git diff --check`, `git status`, and `git diff --stat`.
- [ ] Report exact files and confirm no Git/Pages integration actions.
