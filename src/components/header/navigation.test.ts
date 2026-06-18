import assert from "node:assert/strict"
import test from "node:test"

import { isMenuActive, menus } from "./navigation.ts"

test("article and archive navigation do not both become active on /home", () => {
  const article = menus.find((item) => item.name === "文章")
  const archive = menus.find((item) => item.name === "归档")

  assert.ok(article)
  assert.ok(archive)
  assert.equal(isMenuActive(article, "/home", ""), true)
  assert.equal(isMenuActive(archive, "/home", ""), false)
})

test("archive navigation is active only when the archive query is present", () => {
  const article = menus.find((item) => item.name === "文章")
  const archive = menus.find((item) => item.name === "归档")

  assert.ok(article)
  assert.ok(archive)
  assert.equal(isMenuActive(article, "/home", "?view=archive"), false)
  assert.equal(isMenuActive(archive, "/home", "?view=archive"), true)
})
