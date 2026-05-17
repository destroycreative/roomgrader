import test from "node:test";
import assert from "node:assert/strict";
import { scoreRoomFromPixels, scoreSummary } from "../src/roomScore.js";

function grayscalePixel(value) {
  return [value, value, value, 255];
}

test("clean-looking bright uniform image gets high score", () => {
  const data = new Uint8ClampedArray([
    ...grayscalePixel(220),
    ...grayscalePixel(220),
    ...grayscalePixel(220),
    ...grayscalePixel(220)
  ]);

  const score = scoreRoomFromPixels({ width: 2, height: 2, data });
  assert.ok(score >= 80);
  assert.equal(scoreSummary(score), "Excellent — this room looks very clean.");
});

test("cluttered dark varied image gets lower score", () => {
  const data = new Uint8ClampedArray([
    ...grayscalePixel(20),
    ...grayscalePixel(200),
    ...grayscalePixel(30),
    ...grayscalePixel(210)
  ]);

  const score = scoreRoomFromPixels({ width: 2, height: 2, data });
  assert.ok(score < 50);
  assert.equal(scoreSummary(score), "Messy — focus on decluttering surfaces and floors.");
});
