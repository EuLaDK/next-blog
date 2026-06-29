import assert from "node:assert/strict"
import test from "node:test"

import { isMainlandChinaPhoneNumber } from "./phone-validation.ts"

test("isMainlandChinaPhoneNumber accepts valid mainland China mobile numbers", () => {
  assert.equal(isMainlandChinaPhoneNumber("13800138000"), true)
  assert.equal(isMainlandChinaPhoneNumber("19912345678"), true)
})

test("isMainlandChinaPhoneNumber rejects invalid mobile number formats", () => {
  assert.equal(isMainlandChinaPhoneNumber("12345"), false)
  assert.equal(isMainlandChinaPhoneNumber("12800138000"), false)
  assert.equal(isMainlandChinaPhoneNumber("1380013800a"), false)
  assert.equal(isMainlandChinaPhoneNumber(" 13800138000 "), false)
})
