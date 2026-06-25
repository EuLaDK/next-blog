export type BlogAccent = "teal" | "yellow" | "coral" | "ink"

export type Author = {
  id: string
  name: string
  title: string
  avatarInitials: string
}

export type Category = {
  id?: string
  slug: string
  name: string
  description: string | null
  accent: BlogAccent | string
}

export type Tag = {
  slug: string
  name: string
}

export type PostSection = {
  title: string
  body: string
}

export type Post = {
  slug: string
  title: string
  excerpt: string
  category: Category
  tags: Tag[]
  author: Author
  categoryId?: string
  publishedAt: string
  readingTime: string | null
  views: number
  featured: boolean
  popularityScore: number
  cover: {
    accent: BlogAccent | string
    label: string
  }
  sections: PostSection[]
}

export type Announcement = {
  title: string
  description: string
  actionLabel: string
}

export type PostFilter = {
  query?: string
  categorySlug?: string
  tagSlug?: string
}

export type ArchiveMonthGroup = {
  month: string
  label: string
  posts: Post[]
}

export type ArchiveYearGroup = {
  year: string
  months: ArchiveMonthGroup[]
}

export const author: Author = {
  id: "eula",
  name: "EuLa",
  title: "Next.js learner and frontend builder",
  avatarInitials: "EL",
}

export const categories: Category[] = [
  {
    slug: "nextjs",
    name: "Next.js",
    description: "App Router, rendering strategy, cache notes.",
    accent: "teal",
  },
  {
    slug: "react",
    name: "React",
    description: "Component patterns, state boundaries, UI behavior.",
    accent: "coral",
  },
  {
    slug: "engineering",
    name: "工程化",
    description: "TypeScript, quality gates, project architecture.",
    accent: "yellow",
  },
  {
    slug: "design",
    name: "设计笔记",
    description: "Reading experience, visual systems, product polish.",
    accent: "ink",
  },
]

export const tags: Tag[] = [
  { slug: "isr", name: "ISR" },
  { slug: "auth", name: "Auth" },
  { slug: "markdown", name: "Markdown" },
  { slug: "ui", name: "UI" },
  { slug: "typescript", name: "TypeScript" },
  { slug: "workflow", name: "Workflow" },
]

const tagBySlug = new Map(tags.map((tag) => [tag.slug, tag]))
const categoryBySlug = new Map(categories.map((categoryItem) => [categoryItem.slug, categoryItem]))

/**
 * 根据 slug 获取分类对象，保证 mock 文章不会引用不存在的分类。
 * @param slug 分类唯一标识
 */
function category(slug: string): Category {
  const value = categoryBySlug.get(slug)
  if (!value) {
    throw new Error(`Missing category: ${slug}`)
  }
  return value
}

/**
 * 根据 slug 列表获取标签对象，保证 mock 文章不会引用不存在的标签。
 * @param slugs 标签唯一标识列表
 */
function postTags(slugs: string[]): Tag[] {
  return slugs.map((slug) => {
    const value = tagBySlug.get(slug)
    if (!value) {
      throw new Error(`Missing tag: ${slug}`)
    }
    return value
  })
}

export const allPosts: Post[] = [
  {
    slug: "nextjs-cache-field-notes",
    title: "Next.js 缓存策略田野笔记",
    excerpt: "把 ISR、revalidatePath 和公开内容缓存整理成一条清晰路线，避免博客上线后陷入缓存不更新。",
    category: category("nextjs"),
    tags: postTags(["isr", "typescript", "workflow"]),
    author,
    publishedAt: "2026-06-12",
    readingTime: "8 min",
    views: 2480,
    featured: true,
    popularityScore: 98,
    cover: { accent: "teal", label: "Cache" },
    sections: [
      {
        title: "缓存问题为什么容易出现",
        body: "公开博客最容易遇到的不是页面打不开，而是文章更新后缓存没有按预期刷新。先把静态页面、动态数据和手动 revalidate 的边界分清楚，后续接真实内容源时就不会反复推倒。",
      },
      {
        title: "首页和详情页的缓存差异",
        body: "首页通常更适合短周期刷新，因为它承载最新文章、热门文章和归档入口。文章详情页更稳定，可以在发布或编辑完成后再精准刷新对应 slug。",
      },
      {
        title: "后续接入的方向",
        body: "当 Markdown 或数据库内容接入后，可以把发布动作和 revalidatePath 绑定起来，让内容更新、归档变化和详情页刷新形成一条清晰链路。",
      },
    ],
  },
  {
    slug: "markdown-editor-studio",
    title: "把 Markdown 编辑器做成创作工作台",
    excerpt: "从源码编辑、实时预览、图片插入到自动保存，拆解一套适合个人博客后台的编辑体验。",
    category: category("react"),
    tags: postTags(["markdown", "ui", "workflow"]),
    author,
    publishedAt: "2026-06-09",
    readingTime: "6 min",
    views: 1986,
    featured: false,
    popularityScore: 91,
    cover: { accent: "coral", label: "Editor" },
    sections: [
      {
        title: "编辑器不是输入框",
        body: "博客后台的 Markdown 编辑器应该服务完整创作流程，而不只是保存一段文本。标题、摘要、标签、封面和发布状态都应该围绕写作动作组织。",
      },
      {
        title: "预览和保存要分开",
        body: "实时预览关注阅读效果，自动保存关注数据安全。把这两个状态拆开之后，界面就能清楚告诉作者当前内容是草稿、已保存还是等待发布。",
      },
      {
        title: "先做壳子再接数据",
        body: "当前阶段可以先把编辑工作台的静态结构搭好，后续再接 Prisma、上传和 Markdown 解析，这样每一步都能单独验证。",
      },
    ],
  },
  {
    slug: "designing-reading-systems",
    title: "不是文章列表，是阅读系统",
    excerpt: "首页、分类、标签和热门文章如何组成一个能被快速扫描的知识版面。",
    category: category("design"),
    tags: postTags(["ui", "workflow"]),
    author,
    publishedAt: "2026-06-05",
    readingTime: "5 min",
    views: 1760,
    featured: false,
    popularityScore: 88,
    cover: { accent: "yellow", label: "Reading" },
    sections: [
      {
        title: "文章列表只是入口",
        body: "一个好用的博客不只是把文章排成列表，而是帮助读者快速判断主题、时间、热度和阅读成本。分类、标签和热门文章共同构成阅读地图。",
      },
      {
        title: "扫描优先于装饰",
        body: "首页的视觉应该有记忆点，但不能牺牲扫描效率。标题层级、卡片密度和工具栏位置都应该让读者更快找到下一篇要读的文章。",
      },
      {
        title: "归档承担时间线索",
        body: "时间轨道适合承载写作路径，而首页负责推荐和筛选。两者职责分开后，页面就不会在视觉和信息结构上互相抢戏。",
      },
    ],
  },
  {
    slug: "auth-boundaries-in-next",
    title: "认证边界应该放在哪里",
    excerpt: "用一个博客后台的例子梳理 middleware、服务端校验和客户端会话展示之间的责任边界。",
    category: category("nextjs"),
    tags: postTags(["auth", "typescript"]),
    author,
    publishedAt: "2026-05-29",
    readingTime: "7 min",
    views: 1424,
    featured: false,
    popularityScore: 76,
    cover: { accent: "ink", label: "Auth" },
    sections: [
      {
        title: "认证不只在前端判断",
        body: "后台入口可以在客户端展示登录状态，但真正的权限判断应该放在服务端。这样即使用户绕过界面，也无法直接访问受保护的数据。",
      },
      {
        title: "路由边界要提前规划",
        body: "公开博客、用户中心和后台工作台可以使用不同的访问边界。先把页面职责分清楚，再接 NextAuth 会更稳。",
      },
      {
        title: "先预留不急着接入",
        body: "当前用户页和计划页可以作为入口占位，等内容层稳定后再接登录、收藏、草稿和管理权限。",
      },
    ],
  },
  {
    slug: "type-safe-blog-models",
    title: "先把内容模型想清楚",
    excerpt: "从 mock 数据到 Prisma schema，如何让前台原型不在接后端时推倒重来。",
    category: category("engineering"),
    tags: postTags(["typescript", "workflow"]),
    author,
    publishedAt: "2026-05-22",
    readingTime: "4 min",
    views: 1198,
    featured: false,
    popularityScore: 71,
    cover: { accent: "teal", label: "Model" },
    sections: [
      {
        title: "模型先服务页面",
        body: "mock 数据不是随便写的临时内容，它应该尽量贴近未来的后端模型。这样从本地数据切到 Prisma 或 Markdown 时，组件改动会更少。",
      },
      {
        title: "字段要围绕阅读体验",
        body: "标题、摘要、分类、标签、阅读时间、浏览数和封面信息都直接服务前台展示。正文 sections 则让详情页从固定假内容变成文章自己的内容。",
      },
      {
        title: "替换数据源不替换组件",
        body: "理想状态是页面从 `blog-data.ts` 切到 `posts.ts` 或 Prisma 查询时，`MainContent`、`ArchiveTimeline` 和 `PostPreview` 都能继续复用。",
      },
    ],
  },
  {
    slug: "color-systems-for-blogs",
    title: "个人博客也需要色彩系统",
    excerpt: "用少量强调色建立识别度，同时让阅读正文保持安静。",
    category: category("design"),
    tags: postTags(["ui"]),
    author,
    publishedAt: "2026-05-18",
    readingTime: "3 min",
    views: 986,
    featured: false,
    popularityScore: 63,
    cover: { accent: "coral", label: "Color" },
    sections: [
      {
        title: "少量颜色建立识别",
        body: "个人博客不需要复杂色盘，海绿色、暖黄色、珊瑚色和深墨色已经足够形成视觉记忆。关键是让颜色承担信息层级，而不是到处装饰。",
      },
      {
        title: "正文保持安静",
        body: "阅读页的正文区域应该尽量稳定，颜色主要用于封面、标签和状态提示。这样页面有个性，但长时间阅读不会疲劳。",
      },
      {
        title: "组件复用统一气质",
        body: "首页卡片、归档条目和详情页侧栏可以共享同一套边框、圆角和强调色语言，让整个博客看起来像一个完整产品。",
      },
    ],
  },
]

export const announcement: Announcement = {
  title: "前台原型优先",
  description: "后端方向确定前，先把博客的阅读体验、筛选结构和视觉气质做扎实。",
  actionLabel: "查看路线",
}

/**
 * 根据 featured 标记选出首页主推文章。
 * @param posts 候选文章列表
 */
export function getFeaturedPost(posts: Post[]): Post {
  return posts.find((post) => post.featured) ?? posts[0]
}

/**
 * 按热度分数返回热门文章，避免修改原始文章数组。
 * @param posts 候选文章列表
 * @param limit 返回数量
 */
export function getPopularPosts(posts: Post[], limit = 4): Post[] {
  return [...posts].sort((left, right) => right.popularityScore - left.popularityScore).slice(0, limit)
}

/**
 * 根据搜索词、分类和标签过滤文章。
 * @param posts 候选文章列表
 * @param filter 本地筛选条件
 */
export function filterPosts(posts: Post[], filter: PostFilter): Post[] {
  const query = filter.query?.trim().toLowerCase()

  return posts.filter((post) => {
    const matchesQuery =
      !query ||
      [post.title, post.excerpt, post.category.name, ...post.tags.map((tag) => tag.name)]
        .join(" ")
        .toLowerCase()
        .includes(query)
    const matchesCategory = !filter.categorySlug || post.category.slug === filter.categorySlug
    const matchesTag = !filter.tagSlug || post.tags.some((tag) => tag.slug === filter.tagSlug)

    return matchesQuery && matchesCategory && matchesTag
  })
}

/**
 * 根据 slug 查找单篇文章。
 * @param posts 候选文章列表
 * @param slug 文章唯一标识
 */
export function getPostBySlug(posts: Post[], slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

/**
 * 根据当前文章位置获取上一篇和下一篇。
 * @param posts 按展示顺序排列的文章列表
 * @param slug 当前文章唯一标识
 */
export function getAdjacentPosts(posts: Post[], slug: string): { previous?: Post; next?: Post } {
  const currentIndex = posts.findIndex((post) => post.slug === slug)

  if (currentIndex < 0) {
    return {}
  }

  return {
    previous: posts[currentIndex - 1],
    next: posts[currentIndex + 1],
  }
}

/**
 * 根据分类和共享标签获取相关文章。
 * @param posts 候选文章列表
 * @param currentPost 当前文章
 * @param limit 返回数量
 */
export function getRelatedPosts(posts: Post[], currentPost: Post, limit = 3): Post[] {
  const currentTagSlugs = new Set(currentPost.tags?.map((tag) => tag.slug))

  return posts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const sharedTagCount = post.tags?.filter((tag) => currentTagSlugs.has(tag.slug)).length
      const categoryScore = post.category.slug === currentPost.category.slug ? 2 : 0

      return {
        post,
        score: categoryScore + sharedTagCount,
      }
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || right.post.popularityScore - left.post.popularityScore)
    .slice(0, limit)
    .map((item) => item.post)
}

/**
 * 按发布时间将文章分组成年份和月份归档。
 * @param posts 候选文章列表
 */
export function getArchiveGroups(posts: Post[]): ArchiveYearGroup[] {
  const sortedPosts = [...posts].sort((left, right) => right.publishedAt?.localeCompare(left.publishedAt))
  const yearMap = new Map<string, Map<string, Post[]>>()

  for (const post of sortedPosts) {
    const [year, month] = post.publishedAt.split("-")
    const monthMap = yearMap.get(year) ?? new Map<string, Post[]>()
    const monthPosts = monthMap.get(month) ?? []

    monthPosts.push(post)
    monthMap.set(month, monthPosts)
    yearMap.set(year, monthMap)
  }

  return [...yearMap.entries()].map(([year, monthMap]) => ({
    year,
    months: [...monthMap.entries()].map(([month, monthPosts]) => ({
      month,
      label: `${month} 月`,
      posts: monthPosts,
    })),
  }))
}
