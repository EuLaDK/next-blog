import type { Author, BlogAccent, Category, Post, PostSection, Tag } from "./blog-data"

type PrismaBlogCategory = {
  id: string
  slug: string
  name: string
  description: string | null
  accent: string
}

type PrismaBlogTag = {
  id: string
  slug: string
  name: string
}

type PrismaBlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  published: boolean
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  readingTime: string | null
  views: number
  featured: boolean
  popularityScore: number
  authorId: string
  categoryId: string
  coverAccent: string
  coverLabel: string
  author: {
    id: string
    email: string
    name: string | null
  }
  category: PrismaBlogCategory
  tags: Array<{
    postId: string
    tagId: string
    tag: PrismaBlogTag
  }>
}

export type BlogIndexData = {
  posts: Post[]
  categories: Category[]
  tags: Tag[]
}

const blogAccents = new Set<BlogAccent>(["teal", "yellow", "coral", "ink"])

/**
 * 把数据库中的颜色字符串限制到前台支持的封面色值。
 * @param accent 数据库存储的颜色标识
 */
function toBlogAccent(accent: string): BlogAccent {
  return blogAccents.has(accent as BlogAccent) ? (accent as BlogAccent) : "teal"
}

/**
 * 根据作者名称生成两位头像缩写。
 * @param name 作者名称
 */
function getAuthorInitials(name: string): string {
  return name.slice(0, 2).toUpperCase()
}

/**
 * 把日期格式化成前台文章卡片使用的 yyyy-MM-dd。
 * @param dateInput 数据库中的发布时间
 */
function formatDateToYYYYMMDD(dateInput: Date | null): string {
  if (!dateInput) {
    return ""
  }

  const date = new Date(dateInput)

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid post date")
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

/**
 * 从 Markdown 正文中提取二级标题段落，供阅读页目录和正文预览使用。
 * @param content Markdown 正文
 */
function getSectionsFromMarkdown(content: string): PostSection[] {
  const sections: PostSection[] = []
  const matches = [...content.matchAll(/^##\s+(.+)$/gm)]

  if (matches.length === 0) {
    return [
      {
        title: "正文",
        body: content.trim(),
      },
    ]
  }

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index]
    const nextMatch = matches[index + 1]
    const title = match[1].trim()
    const bodyStart = (match.index ?? 0) + match[0].length
    const bodyEnd = nextMatch?.index ?? content.length
    const body = content.slice(bodyStart, bodyEnd).trim()

    sections.push({
      title,
      body,
    })
  }

  return sections
}

/**
 * 把 Prisma 查询结果转换成前台博客组件需要的 Post 结构。
 * @param post 带分类、标签和作者关联的 Prisma 文章
 */
export function mapPrismaPostToBlogPost(post: PrismaBlogPost): Post {
  const authorName = post.author.name ?? post.author.email
  const author: Author = {
    id: post.author.id,
    name: authorName,
    title: "Blog author",
    avatarInitials: getAuthorInitials(authorName),
  }

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: {
      id: post.category.id,
      slug: post.category.slug,
      name: post.category.name,
      description: post.category.description,
      accent: toBlogAccent(post.category.accent),
    },
    tags: post.tags.map((postTag) => ({
      slug: postTag.tag.slug,
      name: postTag.tag.name,
    })),
    author,
    categoryId: post.categoryId,
    publishedAt: formatDateToYYYYMMDD(post.publishedAt),
    readingTime: post.readingTime ?? "1 min read",
    views: post.views,
    featured: post.featured,
    popularityScore: post.popularityScore,
    cover: {
      accent: toBlogAccent(post.coverAccent),
      label: post.coverLabel,
    },
    sections: getSectionsFromMarkdown(post.content),
  }
}

/**
 * 读取首页和文章浏览页共用的博客数据。
 */
export async function getBlogIndexData(): Promise<BlogIndexData> {
  const { default: prisma } = await import("./prisma")

  const [posts, categories, tags] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    }),
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ])

  return {
    posts: posts.map(mapPrismaPostToBlogPost),
    categories: categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      accent: toBlogAccent(category.accent),
    })),
    tags: tags.map((tag) => ({
      slug: tag.slug,
      name: tag.name,
    })),
  }
}
