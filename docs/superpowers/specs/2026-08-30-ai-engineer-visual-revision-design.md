# AI Engineer Visual Revision

## Goal

Bring the first redesign closer to the approved compact reference without changing its truthful content, stack, Pages behavior, or approved skills section.

## Design

The hero replaces the orbit/AI-engine diagram with an abstract code window surrounded by a technical grid, small nodes, cool connection points, and amber data paths. The code is decorative and hidden from assistive technology. The left-side identity and messaging remain unchanged.

About retains the portrait and approved copy, but replaces three numbered cards with a compact horizontal summary row using dependency-free inline line icons. Skills keeps its existing four-card structure and pointer lighting.

Projects keeps its approved copy and terminal. A focused `project-terminal.js` module types the phrase once when it enters the viewport, then leaves a continuously blinking cursor. Reduced motion and missing IntersectionObserver reveal the completed phrase immediately. The rejected large diamonds are replaced by a perspective grid with nodes, connectors, and small cubes.

Contact becomes four accessible inline-SVG icon links using the existing URLs. Footer uses the approved three-zone layout with identity, central navigation/copyright, and icon links.

## Verification

Tests cover removed hero labels, code panel, compact About summaries, preserved skills, one-shot terminal typing, reduced motion, social accessibility, inline icons, and local references. Final commands are `npm.cmd test`, `npm.cmd run validate`, `git diff --check`, `git status`, and `git diff --stat`.

