export type BlogAccent = "teal" | "yellow" | "coral" | "ink"

export type Author = {
  id: string
  name: string
  title: string
  avatarInitials: string
}

export type Category = {
  slug: string
  name: string
  description: string
  accent: BlogAccent
}

export type Tag = {
  slug: string
  name: string
}

export type Post = {
  slug: string
  title: string
  excerpt: string
  category: Category
  tags: Tag[]
  author: Author
  publishedAt: string
  readingTime: string
  views: number
  featured: boolean
  popularityScore: number
  cover: {
    accent: BlogAccent
    label: string
  }
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
  const currentTagSlugs = new Set(currentPost.tags.map((tag) => tag.slug))

  return posts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const sharedTagCount = post.tags.filter((tag) => currentTagSlugs.has(tag.slug)).length
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
