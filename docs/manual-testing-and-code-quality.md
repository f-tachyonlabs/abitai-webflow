# Manual Testing And Code Quality Guide

## Scope

This document explains how to manually test the AbitAI landing page and how to review the codebase for quality before pushing production changes.

## Local Setup

### Install dependencies

```bash
npm install
npx playwright install chromium
```

### Start a local preview server

```bash
python3 -m http.server 8000
```

Open:

`http://localhost:8000`

## Manual Testing Checklist

### 1. Basic smoke test

Confirm the page loads without broken layout, missing sections, or console-stopping errors.

Check:

- hero video loads
- hero headline is visible and not clipped
- top navigation renders once and does not show a repeated logo background
- intro section shows the chat demo and supporting copy
- problem cards, process cards, feature cards, and footer all render

### 2. Navigation and header review

Inspect the fixed header while scrolling.

Check:

- header stays fixed at the top
- header background stays clean and semi-transparent
- no repeated `Untitled-2.svg` pattern appears
- AbitAI logo appears once at the left
- menu items remain readable against the page background
- mobile menu opens and closes correctly at smaller widths

### 3. Hero section review

Check:

- video fills the hero section without distortion
- hero headline stays inside the viewport
- top spacing accounts for the fixed navbar
- text remains readable on desktop, tablet, portrait mobile, and landscape mobile

### 4. Intro and chat review

Check:

- desktop shows the intro as a two-column layout
- tablet/mobile stack the intro content vertically
- chat card stays inside the viewport bounds
- chat does not grow taller than the screen on short devices
- chat messages animate and scroll correctly
- chat panel does not shrink unexpectedly on Retina/high-density screens when the page is not zoomed

### 5. Content grid review

Review these sections:

- problem cards
- how-it-works cards
- feature cards
- footer columns and social icons

Check:

- no text clipping
- no card overlap
- spacing remains consistent
- cards reflow correctly by breakpoint
- icons and images stay proportionate

### 6. Footer review

Check:

- footer content stacks correctly on tablet/mobile
- text remains readable
- social and legal items are aligned cleanly
- no overflow or excessive empty space appears

### 7. Horizontal overflow review

At each target viewport, scroll horizontally or inspect with devtools.

Check:

- no content pushes the page wider than the viewport
- headings, cards, navbar, and footer all remain contained

### 8. Browser zoom review

On desktop, test browser zoom levels such as `90%`, `100%`, `125%`, and `150%`.

Check:

- chat remains readable
- layout does not collapse
- hero and grids still align correctly

### 9. Asset and loading review

Check:

- local fonts load
- images display at the expected size
- video poster appears if video playback is delayed
- no obvious 404s appear in the network panel

## Recommended Manual Viewports

Test at least these sizes:

- Desktop: `1440x900`
- Laptop: `1280x800`
- Tablet portrait: `834x1194`
- Tablet landscape: `1024x768`
- Mobile portrait: `390x844`
- Mobile landscape: `667x375`
- Small mobile portrait: `360x740`

## DevTools Review Steps

### Device emulation

In browser devtools:

1. Open responsive design mode.
2. Switch through the recommended viewports.
3. Watch for clipping, overlap, or excessive whitespace.

### Console review

Check the console for:

- script errors
- resource-loading failures
- layout-breaking warnings

### Network review

Check the network panel for:

- missing image assets
- missing CSS or JS files
- blocked external resources

## Automated Verification

Run the automated checks after manual review:

```bash
npm run test:unit
npm run test:integration
```

See also:

- `docs/test-results.md`
- `docs/responsive-remediation.md`

## Code Quality Review Checklist

### CSS review

Check:

- responsive overrides live in `css/abitai-overrides.css`
- generated Webflow CSS is not edited unless necessary
- no new fixed `vh` heights are introduced for content sections
- no new brittle `vw`-only widths are introduced for text-heavy components
- spacing and sizing use reusable tokens or clear responsive rules
- overrides are scoped narrowly enough to avoid accidental regressions

### HTML review

Check:

- semantic structure is preserved as much as possible within the Webflow export
- test hooks use stable `data-testid` attributes only where needed
- new markup does not duplicate IDs
- new assets are linked with correct relative paths

### JavaScript review

Check:

- UI behavior logic lives in `js/abitai-chat.js`
- pure logic remains testable outside the browser
- no fallback incorrectly uses `devicePixelRatio` as zoom data
- event listeners are minimal and attached only when required
- DOM queries fail safely if the expected nodes are absent

### Testing review

Check:

- any behavior change is covered by unit tests, integration tests, or both
- viewport-sensitive changes are verified in Playwright
- new regressions get explicit assertions where practical

### Repository hygiene

Check:

- `node_modules/` is not committed
- `test-results/` is not committed
- documentation is updated when behavior changes
- commit messages are specific and scoped to the actual change

## Pre-Push Quality Gate

Before pushing:

1. Preview the page locally.
2. Complete the manual viewport checks.
3. Review browser console and network panels.
4. Run `npm run test:unit`.
5. Run `npm run test:integration`.
6. Review `git diff` for unintended generated changes.
7. Update docs if the behavior, tests, or QA process changed.

## Files To Review Most Often

- `index.html`
- `css/abitai-overrides.css`
- `js/abitai-chat.js`
- `tests/chat-helpers.test.js`
- `tests/responsive.spec.js`
- `docs/test-results.md`
- `docs/responsive-remediation.md`

## Expected Quality Standard

A change is ready to merge only when:

- the page is visually stable across the target viewport matrix
- there is no horizontal overflow
- the fixed navbar remains visually clean
- the chat panel remains readable and bounded
- automated tests pass
- documentation matches the current implementation
