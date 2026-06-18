import assert from "node:assert/strict"
import test from "node:test"

import {
  allPosts,
  categories,
  filterPosts,
  getFeaturedPost,
  getPopularPosts,
  tags,
} from "./blog-data.ts"

test("getFeaturedPost returns the featured post and falls back to the first post", () => {
  const featured = getFeaturedPost(allPosts)

  assert.equal(featured.slug, "nextjs-cache-field-notes")
  assert.equal(getFeaturedPost(allPosts.map((post) => ({ ...post, featured: false }))).slug, allPosts[0].slug)
})

test("getPopularPosts sorts posts by popularity score in descending order", () => {
  const popular = getPopularPosts(allPosts, 3)

  assert.equal(popular.length, 3)
  assert.deepEqual(
    popular.map((post) => post.slug),
    ["nextjs-cache-field-notes", "markdown-editor-studio", "designing-reading-systems"],
  )
})

test("filterPosts matches title, excerpt, category, and tags", () => {
  assert.deepEqual(
    filterPosts(allPosts, { query: "ISR" }).map((post) => post.slug),
    ["nextjs-cache-field-notes"],
  )
  assert.deepEqual(
    filterPosts(allPosts, { categorySlug: "design" }).map((post) => post.slug),
    ["designing-reading-systems", "color-systems-for-blogs"],
  )
  assert.deepEqual(
    filterPosts(allPosts, { tagSlug: "auth" }).map((post) => post.slug),
    ["auth-boundaries-in-next"],
  )
})

test("mock taxonomy data is connected to posts", () => {
  const categorySlugs = new Set(categories.map((category) => category.slug))
  const tagSlugs = new Set(tags.map((tag) => tag.slug))

  for (const post of allPosts) {
    assert.equal(categorySlugs.has(post.category.slug), true)
    for (const tag of post.tags) {
      assert.equal(tagSlugs.has(tag.slug), true)
    }
  }
})
