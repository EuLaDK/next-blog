import assert from "node:assert/strict"
import test from "node:test"

import { getPostSectionId } from "./post-sections.ts"
import { calculateReadingProgress } from "./reading-progress.ts"

test("calculateReadingProgress returns a clamped percentage", () => {
  assert.equal(calculateReadingProgress({ scrollY: 0, scrollHeight: 2000, clientHeight: 1000 }), 0)
  assert.equal(calculateReadingProgress({ scrollY: 500, scrollHeight: 2000, clientHeight: 1000 }), 50)
  assert.equal(calculateReadingProgress({ scrollY: 1200, scrollHeight: 2000, clientHeight: 1000 }), 100)
  assert.equal(calculateReadingProgress({ scrollY: -50, scrollHeight: 2000, clientHeight: 1000 }), 0)
})

test("getPostSectionId returns stable readable section anchors", () => {
  assert.equal(getPostSectionId(0), "section-1")
  assert.equal(getPostSectionId(2), "section-3")
})
