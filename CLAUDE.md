# CLAUDE.md

## Purpose

This repository is a static Webflow-exported landing page for AbitAI.

The project uses a generated Webflow base plus a controlled custom override layer. Any future changes should preserve that separation and maintain the responsive, testable structure added to the repo.

## Core Principles

1. Prefer additive overrides over invasive edits to generated Webflow files.
2. Keep responsive behavior content-driven, not fixed-height-driven.
3. Preserve testability for any custom JavaScript behavior.
4. Treat visual regressions as real defects and cover them with tests where practical.
5. Keep documentation current with implementation and verification changes.

## File Strategy

### Generated files

These files are primarily generated and should be edited only when necessary:

- `index.html`
- `css/webflow.css`
- `css/abitai-d9f442.webflow.css`
- `js/webflow.js`

### Custom files

These files are the preferred place for ongoing work:

- `css/abitai-overrides.css`
- `js/abitai-chat.js`
- `tests/chat-helpers.test.js`
- `tests/responsive.spec.js`
- `docs/responsive-remediation.md`
- `docs/test-results.md`
- `docs/manual-testing-and-code-quality.md`

## CSS Best Practices

1. Put new layout and responsive fixes in `css/abitai-overrides.css`.
2. Avoid editing generated Webflow CSS unless there is no reasonable alternative.
3. Do not introduce new brittle `vh`-locked content sections.
4. Avoid viewport-only sizing for text-heavy UI.
5. Prefer `clamp(...)`, intrinsic sizing, and content-aware spacing.
6. Use shared tokens in `:root` for spacing, widths, and colors when extending the override layer.
7. Prevent horizontal overflow at all supported breakpoints.
8. Treat the fixed navbar as a regression-sensitive area.
   The generated repeating SVG background must remain disabled.

## HTML Best Practices

1. Keep markup changes minimal and deliberate.
2. Preserve existing Webflow structure unless a real defect requires structural change.
3. Add `data-testid` hooks only where they materially support automation.
4. Do not duplicate IDs.
5. Keep asset paths relative and consistent with the current static deployment model.

## JavaScript Best Practices

1. Keep custom behavior in standalone files, not inline script blocks, unless there is a clear constraint.
2. Keep pure logic exportable and testable.
3. Do not use `devicePixelRatio` as a fallback for browser zoom detection.
   Use `visualViewport.scale` when available and default safely otherwise.
4. Guard DOM access so the script fails safely if expected elements are absent.
5. Keep event listeners minimal and scoped to required behavior.

## Responsive Design Rules

The page must remain stable across at least these viewport classes:

- Desktop: `1440x900`
- Tablet portrait: `834x1194`
- Mobile portrait: `390x844`
- Mobile landscape: `667x375`

Expected responsive behavior:

- Hero content stays inside the viewport.
- Intro section is two-column on desktop and stacked on smaller widths.
- Problem/process grids reflow correctly by breakpoint.
- Feature cards collapse correctly on smaller screens.
- Chat stays readable and height-bounded on short/mobile viewports.
- No horizontal overflow appears.

## Testing Requirements

### Unit tests

Use:

```bash
npm run test:unit
```

Unit tests should cover:

- pure JS helpers
- scaling logic
- timing logic
- other deterministic logic introduced in custom scripts

### Integration tests

Use:

```bash
npm run test:integration
```

Integration tests should cover:

- layout containment
- breakpoint reflow
- chat height bounds
- navbar regression checks
- major visual/structural assumptions that can be asserted through DOM metrics

### Before finishing work

Unless explicitly impossible, run:

```bash
npm run test:unit
npm run test:integration
```

If integration tests require browser execution outside a restricted sandbox, note that explicitly in the work summary.

## Manual QA Expectations

Before considering a UI change complete, manually verify:

1. Header behavior while scrolling.
2. Hero readability and spacing.
3. Chat sizing and animation behavior.
4. Card/grid reflow across target viewports.
5. Footer structure and readability.
6. Absence of horizontal overflow.
7. Browser console and network sanity.

Reference:

- `docs/manual-testing-and-code-quality.md`

## Documentation Requirements

If behavior, testing, or QA expectations change, update the relevant docs:

- `README.md`
- `docs/responsive-remediation.md`
- `docs/test-results.md`
- `docs/manual-testing-and-code-quality.md`

Documentation should capture:

- what changed
- why it changed
- how it was tested
- any environment-specific limitations

## Repository Hygiene

1. Do not commit `node_modules/`.
2. Do not commit `test-results/`.
3. Keep `.gitignore` current with generated artifacts.
4. Keep commits scoped and clearly named.
5. Review `git diff` before commit to avoid accidental generated changes.

## Deployment Notes

The site is deployed as a static site through GitHub Pages via GitHub Actions.

Important assumptions:

- the site must work without a build step
- all paths must remain valid for static hosting
- assets must remain compatible with local preview and GitHub Pages

## Preferred Workflow For Future Changes

1. Inspect the existing generated and custom layers before editing.
2. Change the smallest stable surface possible.
3. Put layout/system fixes in `css/abitai-overrides.css`.
4. Put custom interactive logic in standalone JS files.
5. Add or update tests for regressions.
6. Run unit and integration tests.
7. Update documentation.
8. Commit only the intended source and doc changes.
