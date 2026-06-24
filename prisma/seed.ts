import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("Missing DATABASE_URL")
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const seedCategories = [
  {
    slug: "nextjs",
    name: "Next.js",
    description: "App Router、缓存策略和渲染实践。",
    accent: "teal",
  },
  {
    slug: "react",
    name: "React",
    description: "组件边界、状态管理和交互体验。",
    accent: "coral",
  },
  {
    slug: "engineering",
    name: "工程化",
    description: "TypeScript、数据模型和项目架构。",
    accent: "yellow",
  },
  {
    slug: "design",
    name: "设计笔记",
    description: "阅读体验、视觉系统和产品打磨。",
    accent: "ink",
  },
]

const seedTags = [
  { slug: "isr", name: "ISR" },
  { slug: "auth", name: "Auth" },
  { slug: "markdown", name: "Markdown" },
  { slug: "ui", name: "UI" },
  { slug: "typescript", name: "TypeScript" },
  { slug: "workflow", name: "Workflow" },
]

const seedPosts = [
  {
    slug: "nextjs-cache-field-notes",
    title: "Next.js 缓存策略田野笔记",
    excerpt: "记录 App Router 缓存、刷新和真实项目里的踩坑经验。",
    content: `## 缓存问题为什么容易出现

公开博客最容易遇到的不是页面打不开，而是文章更新后缓存没有按预期刷新。先把静态页面、动态数据和手动 revalidate 的边界分清楚，后续接真实内容源时就不会反复推倒。

## 首页和详情页的缓存差异

首页通常更适合短周期刷新，因为它承载最新文章、热门文章和归档入口。文章详情页更稳定，可以在发布或编辑完成后再精准刷新对应 slug。

## 后续接入的方向

当 Markdown 或数据库内容接入后，可以把发布动作和 revalidatePath 绑定起来，让内容更新、归档变化和详情页刷新形成一条清晰链路。`,
    categorySlug: "nextjs",
    tagSlugs: ["isr", "typescript", "workflow"],
    published: true,
    publishedAt: new Date("2026-06-18"),
    readingTime: "6 min read",
    views: 1280,
    featured: true,
    popularityScore: 98,
    coverAccent: "teal",
    coverLabel: "Cache",
  },
  {
    slug: "markdown-editor-studio",
    title: "把 Markdown 编辑器做成创作工作台",
    excerpt: "从标题、摘要、标签到正文预览，整理博客后台编辑体验。",
    content: `## 编辑器不是输入框

博客后台的 Markdown 编辑器应该服务完整创作流程，而不只是保存一段文本。标题、摘要、标签、封面和发布状态都应该围绕写作动作组织。

## 预览和保存要分开

实时预览关注阅读效果，自动保存关注数据安全。把这两个状态拆开之后，界面就能清楚告诉作者当前内容是草稿、已保存还是等待发布。

## 先做壳子再接数据

当前阶段可以先把编辑工作台的静态结构搭好，后续再接 Prisma、上传和 Markdown 解析，这样每一步都能单独验证。`,
    categorySlug: "react",
    tagSlugs: ["markdown", "ui", "workflow"],
    published: true,
    publishedAt: new Date("2026-06-19"),
    readingTime: "8 min read",
    views: 960,
    featured: false,
    popularityScore: 91,
    coverAccent: "coral",
    coverLabel: "Editor",
  },
  {
    slug: "designing-reading-systems",
    title: "不是文章列表，是阅读系统",
    excerpt: "用分类、标签和时间线组织文章，让读者更快找到下一篇要读的内容。",
    content: `## 文章列表只是入口

一个好用的博客不只是把文章排成列表，而是帮助读者快速判断主题、时间、热度和阅读成本。分类、标签和热门文章共同构成阅读地图。

## 扫描优先于装饰

首页的视觉应该有记忆点，但不能牺牲扫描效率。标题层级、卡片密度和工具栏位置都应该让读者更快找到下一篇要读的文章。

## 归档承担时间线索

时间轨道适合承载写作路径，而首页负责推荐和筛选。两者职责分开后，页面就不会在视觉和信息结构上互相抢戏。`,
    categorySlug: "design",
    tagSlugs: ["ui", "workflow"],
    published: true,
    publishedAt: new Date("2026-06-20"),
    readingTime: "5 min read",
    views: 842,
    featured: false,
    popularityScore: 88,
    coverAccent: "yellow",
    coverLabel: "Reading",
  },
  {
    slug: "auth-boundaries-in-next",
    title: "认证边界应该放在哪里",
    excerpt: "梳理公开页面、用户中心和后台管理之间的权限职责。",
    content: `## 认证不只在前端判断

后台入口可以在客户端展示登录状态，但真正的权限判断应该放在服务端。这样即使用户绕过界面，也无法直接访问受保护的数据。

## 路由边界要提前规划

公开博客、用户中心和后台工作台可以使用不同的访问边界。先把页面职责分清楚，再接 NextAuth 会更稳。

## 先预留不急着接入

当前用户页和计划页可以作为入口占位，等内容层稳定后再接登录、收藏、草稿和管理权限。`,
    categorySlug: "nextjs",
    tagSlugs: ["auth", "typescript"],
    published: true,
    publishedAt: new Date("2026-05-28"),
    readingTime: "7 min read",
    views: 620,
    featured: false,
    popularityScore: 76,
    coverAccent: "ink",
    coverLabel: "Auth",
  },
  {
    slug: "type-safe-blog-models",
    title: "先把内容模型想清楚",
    excerpt: "从 mock 数据到 Prisma schema，如何让前台原型不在接后端时推倒重来。",
    content: `## 模型先服务页面

mock 数据不是随便写的临时内容，它应该尽量贴近未来的后端模型。这样从本地数据切到 Prisma 或 Markdown 时，组件改动会更少。

## 字段要围绕阅读体验

标题、摘要、分类、标签、阅读时间、浏览数和封面信息都直接服务前台展示。正文 content 则让详情页从固定假内容变成文章自己的内容。

## 替换数据源不替换组件

理想状态是页面从 blog-data.ts 切到 posts.ts 或 Prisma 查询时，MainContent、ArchiveTimeline 和 PostPreview 都能继续复用。`,
    categorySlug: "engineering",
    tagSlugs: ["typescript", "workflow"],
    published: true,
    publishedAt: new Date("2026-05-30"),
    readingTime: "6 min read",
    views: 514,
    featured: false,
    popularityScore: 71,
    coverAccent: "teal",
    coverLabel: "Model",
  },
  {
    slug: "color-systems-for-blogs",
    title: "个人博客也需要色彩系统",
    excerpt: "用少量稳定的颜色建立博客识别度，同时保证阅读舒适。",
    content: `## 少量颜色建立识别

个人博客不需要复杂色盘，海绿色、暖黄色、珊瑚色和深墨色已经足够形成视觉记忆。关键是让颜色承担信息层级，而不是到处装饰。

## 正文保持安静

阅读页的正文区域应该尽量稳定，颜色主要用于封面、标签和状态提示。这样页面有个性，但长时间阅读不会疲劳。

## 组件复用统一气质

首页卡片、归档条目和详情页侧栏可以共享同一套边框、圆角和强调色语言，让整个博客看起来像一个完整产品。`,
    categorySlug: "design",
    tagSlugs: ["ui"],
    published: true,
    publishedAt: new Date("2026-05-31"),
    readingTime: "4 min read",
    views: 438,
    featured: false,
    popularityScore: 63,
    coverAccent: "coral",
    coverLabel: "Color",
  },
]

/**
 * 写入博客开发阶段需要的作者、分类、标签和文章测试数据。
 * @returns 数据写入完成后的 Promise
 */
async function main() {
  await prisma.postTag.deleteMany()
  await prisma.post.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  const author = await prisma.user.upsert({
    where: {
      email: "2585671067@qq.com",
    },
    update: {
      name: "EuLaDK",
    },
    create: {
      email: "2585671067@qq.com",
      name: "EuLaDK",
    },
  })

  const categoryIdBySlug = new Map<string, string>()
  const tagIdBySlug = new Map<string, string>()

  for (const category of seedCategories) {
    const savedCategory = await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: category,
      create: category,
    })

    categoryIdBySlug.set(savedCategory.slug, savedCategory.id)
  }

  for (const tag of seedTags) {
    const savedTag = await prisma.tag.upsert({
      where: {
        slug: tag.slug,
      },
      update: tag,
      create: tag,
    })

    tagIdBySlug.set(savedTag.slug, savedTag.id)
  }

  for (const { categorySlug, tagSlugs, ...post } of seedPosts) {
    const categoryId = categoryIdBySlug.get(categorySlug)

    if (!categoryId) {
      throw new Error(`Missing category: ${categorySlug}`)
    }

    const savedPost = await prisma.post.upsert({
      where: {
        slug: post.slug,
      },
      update: {
        ...post,
        authorId: author.id,
        categoryId,
      },
      create: {
        ...post,
        authorId: author.id,
        categoryId,
      },
    })

    await prisma.postTag.deleteMany({
      where: {
        postId: savedPost.id,
      },
    })

    await prisma.postTag.createMany({
      data: tagSlugs.map((tagSlug) => {
        const tagId = tagIdBySlug.get(tagSlug)

        if (!tagId) {
          throw new Error(`Missing tag: ${tagSlug}`)
        }

        return {
          postId: savedPost.id,
          tagId,
        }
      }),
      skipDuplicates: true,
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
