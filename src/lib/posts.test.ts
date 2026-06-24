import assert from "node:assert/strict"
import test from "node:test"

import { mapPrismaPostToBlogPost } from "./posts.ts"

test("mapPrismaPostToBlogPost keeps taxonomy, cover, author, and sections for blog UI", () => {
  const post = mapPrismaPostToBlogPost({
    slug: "nextjs-cache-field-notes",
    title: "Next.js 缓存策略田野笔记",
    excerpt: "记录缓存策略。",
    content: `## 第一段

这里是第一段正文。

## 第二段

这里是第二段正文。`,
    published: true,
    publishedAt: new Date("2026-06-18T00:00:00.000Z"),
    createdAt: new Date("2026-06-18T00:00:00.000Z"),
    updatedAt: new Date("2026-06-18T00:00:00.000Z"),
    readingTime: "6 min read",
    views: 1280,
    featured: true,
    popularityScore: 98,
    authorId: "author-1",
    categoryId: "category-1",
    coverAccent: "teal",
    coverLabel: "Cache",
    author: {
      id: "author-1",
      email: "2585671067@qq.com",
      name: "EuLaDK",
    },
    category: {
      id: "category-1",
      slug: "nextjs",
      name: "Next.js",
      description: "App Router、缓存策略和渲染实践。",
      accent: "teal",
    },
    tags: [
      {
        postId: "post-1",
        tagId: "tag-1",
        tag: {
          id: "tag-1",
          slug: "isr",
          name: "ISR",
        },
      },
    ],
  })

  assert.equal(post.category.name, "Next.js")
  assert.deepEqual(
    post.tags.map((tag) => tag.slug),
    ["isr"],
  )
  assert.deepEqual(post.cover, { accent: "teal", label: "Cache" })
  assert.equal(post.author.name, "EuLaDK")
  assert.equal(post.author.avatarInitials, "EU")
  assert.deepEqual(
    post.sections.map((section) => section.title),
    ["第一段", "第二段"],
  )
})
