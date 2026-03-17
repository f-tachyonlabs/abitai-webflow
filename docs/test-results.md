# Test Documentation And Results

## Scope

This document captures the automated test coverage added for the responsive remediation work, the exact test commands used, the scenarios covered, and the latest verified results committed to the repository.

## Test Suites

### Unit tests

File:

- `tests/chat-helpers.test.js`

Targeted logic:

- viewport zoom detection
- chat inverse-scale guard behavior
- desktop zoom damping bounds
- conversation loop duration calculation

Command:

```bash
npm run test:unit
```

Implementation detail:

- Runs with Node's built-in test runner via `node --test`.
- Covers pure functions exported from `js/abitai-chat.js`.

### Integration tests

File:

- `tests/responsive.spec.js`

Command:

```bash
npm run test:integration
```

Implementation detail:

- Runs with Playwright using Chromium.
- Loads the real page and checks computed layout metrics.
- Verifies behavior at representative desktop, tablet, portrait mobile, and landscape mobile viewports.

## Test Environment

### Tooling

- Node.js `v24.14.0`
- npm `11.9.0`
- `@playwright/test` `^1.58.2`
- Playwright Chromium runtime installed locally

### Browser coverage

The integration suite was executed against Chromium in headless mode.

Viewport matrix:

- Desktop: `1440x900`
- Tablet: `834x1194`
- Mobile portrait: `390x844`
- Mobile landscape: `667x375`

## Assertions Covered

### Unit assertions

1. `getViewportScale` uses `visualViewport.scale` when available.
2. `getViewportScale` does not incorrectly fall back to `devicePixelRatio`.
3. `computeChatScale` does not shrink chat on narrow screens.
4. `computeChatScale` clamps desktop zoom damping to the configured floor.
5. `getConversationDuration` returns the final delay plus the reset interval.

### Integration assertions

1. No horizontal overflow at each tested viewport.
2. Desktop intro section remains two-column.
3. Tablet intro section stacks vertically.
4. Problems grid reflows correctly across desktop, tablet, and mobile.
5. Feature cards collapse correctly on smaller viewports.
6. Hero heading remains contained within the viewport bounds.
7. Desktop hero heading stays in the central vertical region of the hero instead of hugging the bottom edge.
8. Chat height stays bounded on portrait and landscape mobile layouts.
9. Navbar background image remains disabled and does not render the repeated SVG asset.

## Latest Verified Results

### Unit test result

Command:

```bash
npm run test:unit
```

Latest verified outcome:

```text
✔ getViewportScale prefers visualViewport scale
✔ getViewportScale ignores devicePixelRatio when no zoom data exists
✔ computeChatScale does not shrink the chat on narrow screens
✔ computeChatScale dampens desktop zoom without collapsing below the floor
✔ getConversationDuration uses the final message delay plus the reset gap

5 tests passed
0 tests failed
```

### Integration test result

Command:

```bash
npm run test:integration
```

Latest verified outcome:

```text
✓ desktop layout keeps the intro split into two columns without horizontal overflow
✓ tablet layout stacks the intro, keeps the problems grid in two columns, and avoids overflow
✓ mobile portrait layout collapses cards into one column and constrains the chat height
✓ mobile landscape keeps the chat within the short viewport and preserves horizontal containment

4 tests passed
0 tests failed
```

## Test History Notes

### Responsive remediation cycle

- The first browser test attempt failed because the sandbox blocked local port binding for an ad hoc static server.
- The suite was adjusted to load the page from `file://` instead of requiring a bound local server.
- A later browser run exposed one real desktop alignment issue in the intro section.
- That issue was fixed by aligning the intro grid to the top edge.
- A later visual review exposed a repeated SVG background in the fixed navbar.
- The fix was added in `css/abitai-overrides.css`, and a regression assertion was added to the Playwright suite.
- A later visual review found the hero headline sitting too close to the bottom of the video.
- The hero container alignment was changed to vertical centering, the legacy spacer block was disabled, and the desktop integration test gained a vertical-position assertion.

### Execution note

- In this environment, Playwright Chromium required running outside the default sandbox to complete browser-based verification successfully.

## Relevant Files

- `js/abitai-chat.js`
- `tests/chat-helpers.test.js`
- `tests/responsive.spec.js`
- `playwright.config.js`
- `docs/responsive-remediation.md`
- `docs/manual-testing-and-code-quality.md`

## Re-run Instructions

From the repository root:

```bash
npm install
npx playwright install chromium
npm run test:unit
npm run test:integration
```
