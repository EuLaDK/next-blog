import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import {PrismaClient} from '../src/generated/prisma'

const connectionString = process.env.DATABASE_URL

if(!connectionString) {
    throw new Error("连接失败")
}

const adapter = new PrismaPg({connectionString})
const prisma = new PrismaClient({adapter})

async function main() {
  const author = await prisma.user.upsert({
    where: {
      email: "2585671068@qq.com",
    },
    update: {
      name: "EuLaDK",
    },
    create: {
      email: "2585671068@qq.com",
      name: "EuLaDK",
    },
  })

  const posts = [
    {
      slug: "nextjs-cache-field-notes",
      title: "Next.js 缓存策略田野笔记",
      excerpt: "记录 App Router 缓存、刷新和真实项目里的踩坑经验。",
      content: `## 缓存问题为什么容易出现

公开博客最容易遇到的不是页面打不开，而是文章更新后缓存没有按预期刷新。

## 首页和详情页的缓存差异

首页适合短周期刷新，文章详情页更适合在发布或编辑后精准刷新。`,
      published: true,
      publishedAt: new Date("2026-06-18"),
      readingTime: "6 min read",
      views: 1280,
      featured: true,
      popularityScore: 98,
    },
    {
      slug: "markdown-editor-studio",
      title: "把 Markdown 编辑器做成创作工作台",
      excerpt: "从标题、摘要、标签到正文预览，整理博客后台编辑体验。",
      content: `## 编辑器不是输入框

博客后台的 Markdown 编辑器应该服务完整创作流程，而不只是保存一段文本。

## 预览和保存要分开

实时预览关注阅读效果，自动保存关注数据安全。`,
      published: true,
      publishedAt: new Date("2026-06-19"),
      readingTime: "8 min read",
      views: 960,
      featured: false,
      popularityScore: 91,
    },
  ]

  for (const post of posts) {
    await prisma.post.upsert({
      where: {
        slug: post.slug,
      },
      update: {
        ...post,
        authorId: author.id,
      },
      create: {
        ...post,
        authorId: author.id,
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })