import assert from "node:assert/strict"
import test from "node:test"

import {
  allPosts,
  categories,
  filterPosts,
  getAdjacentPosts,
  getArchiveGroups,
  getFeaturedPost,
  getPopularPosts,
  getPostBySlug,
  getRelatedPosts,
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

test("mock posts include readable sections for the post preview", () => {
  for (const post of allPosts) {
    assert.ok(post.sections.length > 0, `${post.slug} should have at least one section`)

    for (const section of post.sections) {
      assert.notEqual(section.title.trim(), "", `${post.slug} section title should not be empty`)
      assert.notEqual(section.body.trim(), "", `${post.slug} section body should not be empty`)
    }
  }
})

test("getPostBySlug returns a post by slug and undefined for a missing slug", () => {
  assert.equal(getPostBySlug(allPosts, "markdown-editor-studio")?.title, "把 Markdown 编辑器做成创作工作台")
  assert.equal(getPostBySlug(allPosts, "missing-post"), undefined)
})

test("getAdjacentPosts returns previous and next posts from the current order", () => {
  assert.deepEqual(
    {
      previous: getAdjacentPosts(allPosts, "markdown-editor-studio").previous?.slug,
      next: getAdjacentPosts(allPosts, "markdown-editor-studio").next?.slug,
    },
    {
      previous: "nextjs-cache-field-notes",
      next: "designing-reading-systems",
    },
  )
  assert.equal(getAdjacentPosts(allPosts, "nextjs-cache-field-notes").previous, undefined)
  assert.equal(getAdjacentPosts(allPosts, "color-systems-for-blogs").next, undefined)
})

test("getRelatedPosts prefers same-category and shared-tag posts without returning current post", () => {
  const related = getRelatedPosts(allPosts, allPosts[2], 2)

  assert.deepEqual(
    related.map((post) => post.slug),
    ["color-systems-for-blogs", "markdown-editor-studio"],
  )
})

test("getArchiveGroups groups posts by year and month in descending date order", () => {
  const archiveGroups = getArchiveGroups(allPosts)

  assert.equal(archiveGroups[0].year, "2026")
  assert.deepEqual(
    archiveGroups[0].months.map((month) => month.label),
    ["06 月", "05 月"],
  )
  assert.deepEqual(
    archiveGroups[0].months[0].posts.map((post) => post.slug),
    ["nextjs-cache-field-notes", "markdown-editor-studio", "designing-reading-systems"],
  )
  assert.deepEqual(
    archiveGroups[0].months[1].posts.map((post) => post.slug),
    ["auth-boundaries-in-next", "type-safe-blog-models", "color-systems-for-blogs"],
  )
})
