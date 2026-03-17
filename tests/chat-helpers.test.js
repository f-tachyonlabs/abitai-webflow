const test = require("node:test");
const assert = require("node:assert/strict");

const {
  computeChatScale,
  getConversationDuration,
  getViewportScale
} = require("../js/abitai-chat.js");

test("getViewportScale prefers visualViewport scale", () => {
  const scale = getViewportScale({
    visualViewport: {
      scale: 1.8
    },
    devicePixelRatio: 2
  });

  assert.equal(scale, 1.8);
});

test("getViewportScale ignores devicePixelRatio when no zoom data exists", () => {
  const scale = getViewportScale({
    devicePixelRatio: 2
  });

  assert.equal(scale, 1);
});

test("computeChatScale does not shrink the chat on narrow screens", () => {
  const scale = computeChatScale({
    viewportScale: 2,
    innerWidth: 390
  });

  assert.equal(scale, 1);
});

test("computeChatScale dampens desktop zoom without collapsing below the floor", () => {
  const scale = computeChatScale({
    viewportScale: 3,
    innerWidth: 1440
  });

  assert.equal(scale, 0.82);
});

test("getConversationDuration uses the final message delay plus the reset gap", () => {
  const duration = getConversationDuration([
    { delay: 1000 },
    { delay: 7000 }
  ]);

  assert.equal(duration, 11000);
});
