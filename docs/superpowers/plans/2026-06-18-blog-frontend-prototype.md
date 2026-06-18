# Blog Frontend Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved magazine-style frontend prototype for the public blog using typed mock data and the existing Next.js App Router project.

**Architecture:** Keep pages as server components where practical, with a focused client component for local search/filter state. Mock data lives in `src/lib/blog-data.ts` with pure selector helpers that can later be replaced by Prisma queries. Existing home component files are reused as the three visible regions: taxonomy rail, editorial content, and tools rail.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS 4, existing shadcn UI primitives, lucide-react icons, Node built-in test runner for pure data helper tests.

---

## Assumptions And Tradeoffs

- The project does not have Naive UI installed. Use the existing shadcn/lucide setup instead of adding a new UI library.
- Follow `AGENTS.md`: keep changes surgical, avoid speculative backend work, add Chinese comments for new functions, and prefer scoped verification over full builds unless explicitly requested.
- This plan does not add Prisma, NextAuth, Markdown rendering, or a dedicated test framework.
- Browser verification is required for the final UI because most value in this task is visual and responsive behavior.

## Success Criteria

1. Typed mock blog data and pure selectors exist and have Node test coverage.
2. `/` renders the polished magazine-style blog homepage.
3. `/home` renders a denser article browsing surface using the same data/components.
4. Header, left taxonomy rail, central article area, and right tools rail are responsive.
5. Local search/category/tag interactions work without backend dependencies.
6. Scoped lint and browser checks confirm no obvious breakage or overlap in the touched UI.

## Verification Plan

1. Data helpers -> verify: `node --test src/lib/blog-data.test.ts`
2. Modified TypeScript/TSX files -> verify: `npm run lint -- src/app src/components src/lib`
3. Local UI -> verify: start Next dev server and inspect `/`, `/home`, `/user` at desktop and mobile widths in the browser

## File Structure

- Create `src/lib/blog-data.ts`: typed mock data, selector helpers, and local filtering function.
- Create `src/lib/blog-data.test.ts`: Node tests for the pure data helpers.
- Create `src/components/home/BlogExperience.tsx`: client state coordinator for category/tag/search filtering.
- Modify `src/components/header/Header.tsx`: redesigned responsive blog header.
- Modify `src/components/home/LeftMenu.tsx`: taxonomy rail.
- Modify `src/components/home/MainContent.tsx`: editorial hero, announcement, article list, empty state.
- Modify `src/components/home/RighTools.tsx`: right-side search, popular posts, reading tools.
- Modify `src/app/layout.tsx`: metadata, language, page shell.
- Modify `src/app/globals.css`: theme variables and editorial base styles.
- Modify `src/app/page.tsx`: homepage data wiring.
- Modify `src/app/home/page.tsx`: denser article browsing page.
- Modify `src/app/user/page.tsx`: lightweight profile/coming-soon route.

---

### Task 1: Typed Blog Data And Selectors

**Files:**
- Create: `src/lib/blog-data.test.ts`
- Create: `src/lib/blog-data.ts`

- [ ] **Step 1: Write the failing data helper tests**

Create `src/lib/blog-data.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails before implementation**

Run:

```bash
node --test src/lib/blog-data.test.ts
```

Expected: FAIL with a module-not-found error for `src/lib/blog-data.ts`.

- [ ] **Step 3: Add typed mock data and pure selectors**

Create `src/lib/blog-data.ts`:

```ts
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
const categoryBySlug = new Map(categories.map((category) => [category.slug, category]))

function category(slug: string): Category {
  const value = categoryBySlug.get(slug)
  if (!value) {
    throw new Error(`Missing category: ${slug}`)
  }
  return value
}

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
```

- [ ] **Step 4: Run the data helper tests**

Run:

```bash
node --test src/lib/blog-data.test.ts
```

Expected: PASS with 4 tests passing.

- [ ] **Step 5: Commit Task 1**

Run:

```bash
git add src/lib/blog-data.ts src/lib/blog-data.test.ts
git commit -m "feat: add typed blog mock data"
```

---

### Task 2: Global Shell And Editorial Theme

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update root metadata and shell**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { Header } from "@/components/header/Header"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "EuLa Blog",
  description: "A magazine-style frontend prototype for a personal Next.js blog.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(135,196,177,0.26),transparent_34%),linear-gradient(180deg,#f7f2e8_0%,#fbfaf7_42%,#f4f0e7_100%)]">
          <Header />
          <main className="mx-auto w-full max-w-[1480px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update theme variables and base utility classes**

In `src/app/globals.css`, keep the existing imports and `@theme inline` block. Replace only the `:root`, `.dark`, and `@layer base` blocks with the editorial palette below:

```css
:root {
  --background: oklch(0.976 0.018 83.7);
  --foreground: oklch(0.17 0.018 72);
  --card: oklch(0.995 0.006 90);
  --card-foreground: oklch(0.17 0.018 72);
  --popover: oklch(0.995 0.006 90);
  --popover-foreground: oklch(0.17 0.018 72);
  --primary: oklch(0.18 0.02 72);
  --primary-foreground: oklch(0.98 0.012 83);
  --secondary: oklch(0.9 0.06 174);
  --secondary-foreground: oklch(0.17 0.018 72);
  --muted: oklch(0.92 0.018 83);
  --muted-foreground: oklch(0.48 0.018 72);
  --accent: oklch(0.86 0.13 87);
  --accent-foreground: oklch(0.17 0.018 72);
  --destructive: oklch(0.59 0.2 24);
  --border: oklch(0.78 0.02 82);
  --input: oklch(0.78 0.02 82);
  --ring: oklch(0.65 0.08 174);
  --chart-1: oklch(0.78 0.1 174);
  --chart-2: oklch(0.84 0.12 87);
  --chart-3: oklch(0.7 0.16 27);
  --chart-4: oklch(0.4 0.03 72);
  --chart-5: oklch(0.68 0.07 230);
  --radius: 0.625rem;
  --sidebar: oklch(0.965 0.016 83);
  --sidebar-foreground: oklch(0.17 0.018 72);
  --sidebar-primary: oklch(0.18 0.02 72);
  --sidebar-primary-foreground: oklch(0.98 0.012 83);
  --sidebar-accent: oklch(0.9 0.06 174);
  --sidebar-accent-foreground: oklch(0.17 0.018 72);
  --sidebar-border: oklch(0.78 0.02 82);
  --sidebar-ring: oklch(0.65 0.08 174);
}

.dark {
  --background: oklch(0.16 0.015 72);
  --foreground: oklch(0.95 0.012 83);
  --card: oklch(0.21 0.018 72);
  --card-foreground: oklch(0.95 0.012 83);
  --popover: oklch(0.21 0.018 72);
  --popover-foreground: oklch(0.95 0.012 83);
  --primary: oklch(0.9 0.06 174);
  --primary-foreground: oklch(0.16 0.015 72);
  --secondary: oklch(0.3 0.04 174);
  --secondary-foreground: oklch(0.95 0.012 83);
  --muted: oklch(0.25 0.018 72);
  --muted-foreground: oklch(0.72 0.018 83);
  --accent: oklch(0.76 0.12 87);
  --accent-foreground: oklch(0.16 0.015 72);
  --destructive: oklch(0.64 0.18 24);
  --border: oklch(1 0 0 / 14%);
  --input: oklch(1 0 0 / 18%);
  --ring: oklch(0.65 0.08 174);
  --chart-1: oklch(0.78 0.1 174);
  --chart-2: oklch(0.84 0.12 87);
  --chart-3: oklch(0.7 0.16 27);
  --chart-4: oklch(0.55 0.03 72);
  --chart-5: oklch(0.68 0.07 230);
  --sidebar: oklch(0.2 0.018 72);
  --sidebar-foreground: oklch(0.95 0.012 83);
  --sidebar-primary: oklch(0.78 0.1 174);
  --sidebar-primary-foreground: oklch(0.16 0.015 72);
  --sidebar-accent: oklch(0.27 0.03 174);
  --sidebar-accent-foreground: oklch(0.95 0.012 83);
  --sidebar-border: oklch(1 0 0 / 14%);
  --sidebar-ring: oklch(0.65 0.08 174);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  html {
    @apply font-sans;
  }

  body {
    @apply bg-background text-foreground;
  }

  ::selection {
    @apply bg-primary text-primary-foreground;
  }
}
```

- [ ] **Step 3: Run scoped lint for app shell**

Run:

```bash
npm run lint -- src/app/layout.tsx
```

Expected: PASS with no ESLint errors in `layout.tsx`.

- [ ] **Step 4: Commit Task 2**

Run:

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "style: add editorial blog shell"
```

---

### Task 3: Blog Header

**Files:**
- Modify: `src/components/header/Header.tsx`

- [ ] **Step 1: Replace the placeholder navigation with the blog header**

Replace `src/components/header/Header.tsx` with:

```tsx
"use client"

import { Menu, Moon, Search, Sparkles, User, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const menus = [
  { name: "首页", href: "/" },
  { name: "文章", href: "/home" },
  { name: "归档", href: "/home?view=archive" },
  { name: "关于", href: "/user" },
]

/**
 * 渲染博客全局顶部导航，并在移动端提供折叠菜单。
 * @returns 博客头部导航组件
 */
export const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  /**
   * 切换页面路由，并在移动端导航后关闭菜单。
   * @param href 目标页面路径
   */
  const handleNavigate = (href: string) => {
    router.push(href)
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/15 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          className="flex items-center gap-3 text-left"
          type="button"
          onClick={() => handleNavigate("/")}
          aria-label="回到首页"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-foreground text-background shadow-[4px_4px_0_rgba(0,0,0,0.12)]">
            <Sparkles className="size-5" />
          </span>
          <span>
            <span className="block text-lg font-black leading-none tracking-normal">EuLa Blog</span>
            <span className="text-xs text-muted-foreground">Next.js reading studio</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-foreground/15 bg-card/70 p-1 lg:flex">
          {menus.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("?")[0])

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  "h-9 rounded-full px-4 text-sm font-medium transition hover:bg-muted",
                  active && "bg-foreground text-background hover:bg-foreground",
                )}
              >
                {item.name}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button className="hidden sm:inline-flex" variant="outline" size="icon" aria-label="搜索">
            <Search />
          </Button>
          <Button className="hidden sm:inline-flex" variant="outline" size="icon" aria-label="切换主题">
            <Moon />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="用户菜单">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>EuLa Studio</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleNavigate("/user")}>个人资料</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/home")}>文章列表</DropdownMenuItem>
                <DropdownMenuItem>写作计划</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>GitHub</DropdownMenuItem>
              <DropdownMenuItem>订阅更新</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="lg:hidden"
            variant="outline"
            size="icon"
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-foreground/10 bg-background/95 px-4 py-3 lg:hidden">
          <nav className="grid gap-2">
            {menus.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className="h-11 rounded-xl border border-foreground/10 bg-card px-4 text-left text-sm font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
```

- [ ] **Step 2: Run scoped lint for header**

Run:

```bash
npm run lint -- src/components/header/Header.tsx
```

Expected: PASS with no ESLint errors in `Header.tsx`.

- [ ] **Step 3: Commit Task 3**

Run:

```bash
git add src/components/header/Header.tsx
git commit -m "feat: redesign blog header"
```

---

### Task 4: Magazine Blog Experience Components

**Files:**
- Create: `src/components/home/BlogExperience.tsx`
- Modify: `src/components/home/LeftMenu.tsx`
- Modify: `src/components/home/MainContent.tsx`
- Modify: `src/components/home/RighTools.tsx`

- [ ] **Step 1: Create the client state coordinator**

Create `src/components/home/BlogExperience.tsx`:

```tsx
"use client"

import { useMemo, useState } from "react"

import { LeftMenu } from "@/components/home/LeftMenu"
import { MainContent } from "@/components/home/MainContent"
import { RightTools } from "@/components/home/RighTools"
import {
  type Announcement,
  type Category,
  type Post,
  type Tag,
  filterPosts,
  getFeaturedPost,
  getPopularPosts,
} from "@/lib/blog-data"

export type BlogExperienceProps = {
  posts: Post[]
  categories: Category[]
  tags: Tag[]
  announcement: Announcement
  dense?: boolean
}

/**
 * 管理前台博客的本地搜索、分类和标签筛选状态。
 * @param props 博客文章、分类、标签和公告数据
 */
export const BlogExperience = ({ posts, categories, tags, announcement, dense = false }: BlogExperienceProps) => {
  const [query, setQuery] = useState("")
  const [categorySlug, setCategorySlug] = useState<string>()
  const [tagSlug, setTagSlug] = useState<string>()

  const featuredPost = getFeaturedPost(posts)
  const popularPosts = getPopularPosts(posts, 4)
  const filteredPosts = useMemo(
    () => filterPosts(posts, { query, categorySlug, tagSlug }),
    [categorySlug, posts, query, tagSlug],
  )

  /**
   * 清空所有本地筛选条件。
   */
  const clearFilters = () => {
    setQuery("")
    setCategorySlug(undefined)
    setTagSlug(undefined)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_300px]">
      <LeftMenu
        categories={categories}
        tags={tags}
        posts={posts}
        activeCategorySlug={categorySlug}
        activeTagSlug={tagSlug}
        onSelectCategory={setCategorySlug}
        onSelectTag={setTagSlug}
        onClearFilters={clearFilters}
      />
      <MainContent
        announcement={announcement}
        dense={dense}
        featuredPost={featuredPost}
        posts={filteredPosts}
        totalPosts={posts.length}
        activeCategory={categories.find((category) => category.slug === categorySlug)}
        activeTag={tags.find((tag) => tag.slug === tagSlug)}
        query={query}
        onClearFilters={clearFilters}
      />
      <RightTools
        className="lg:col-span-2 xl:col-span-1"
        query={query}
        onQueryChange={setQuery}
        popularPosts={popularPosts}
        onSelectTag={setTagSlug}
      />
    </div>
  )
}
```

- [ ] **Step 2: Replace `LeftMenu.tsx` with the taxonomy rail**

Replace `src/components/home/LeftMenu.tsx` with:

```tsx
import { BookOpen, Hash, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { type Category, type Post, type Tag } from "@/lib/blog-data"
import { cn } from "@/lib/utils"

type LeftMenuProps = {
  categories: Category[]
  tags: Tag[]
  posts: Post[]
  activeCategorySlug?: string
  activeTagSlug?: string
  onSelectCategory: (slug: string | undefined) => void
  onSelectTag: (slug: string | undefined) => void
  onClearFilters: () => void
}

const accentClasses: Record<Category["accent"], string> = {
  teal: "bg-[oklch(0.9_0.06_174)]",
  yellow: "bg-[oklch(0.88_0.12_87)]",
  coral: "bg-[oklch(0.76_0.14_28)] text-white",
  ink: "bg-foreground text-background",
}

/**
 * 渲染博客分类和标签导航。
 * @param props 分类、标签、文章数量和筛选回调
 */
export const LeftMenu = ({
  categories,
  tags,
  posts,
  activeCategorySlug,
  activeTagSlug,
  onSelectCategory,
  onSelectTag,
  onClearFilters,
}: LeftMenuProps) => {
  /**
   * 统计某个分类下的文章数量。
   * @param slug 分类唯一标识
   */
  const getCategoryCount = (slug: string) => posts.filter((post) => post.category.slug === slug).length

  return (
    <aside className="rounded-2xl border border-foreground/15 bg-card/80 p-4 shadow-[6px_6px_0_rgba(25,25,25,0.08)] lg:sticky lg:top-20 lg:self-start">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">EuLa Blog</p>
          <h2 className="mt-2 text-2xl font-black leading-tight">阅读地图</h2>
        </div>
        <span className="grid size-10 place-items-center rounded-xl bg-foreground text-background">
          <BookOpen className="size-5" />
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        用分类找到主题，用标签追踪线索。第一版先服务阅读体验，后端方向确定后再接真实内容。
      </p>

      <div className="mt-6 space-y-2">
        {categories.map((category) => {
          const active = activeCategorySlug === category.slug

          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => onSelectCategory(active ? undefined : category.slug)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border border-foreground/10 bg-background px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-foreground/30",
                active && "border-foreground bg-foreground text-background",
              )}
            >
              <span>
                <span className="block text-sm font-bold">{category.name}</span>
                <span className={cn("mt-1 block text-xs text-muted-foreground", active && "text-background/70")}>
                  {category.description}
                </span>
              </span>
              <span className={cn("rounded-full px-2 py-1 text-xs font-bold", active ? "bg-background text-foreground" : accentClasses[category.accent])}>
                {getCategoryCount(category.slug)}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold">
          <Hash className="size-4" />
          标签索引
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = activeTagSlug === tag.slug

            return (
              <button
                key={tag.slug}
                type="button"
                onClick={() => onSelectTag(active ? undefined : tag.slug)}
                className={cn(
                  "rounded-full border border-foreground/15 bg-background px-3 py-1.5 text-xs font-semibold transition hover:border-foreground",
                  active && "border-foreground bg-foreground text-background",
                )}
              >
                #{tag.name}
              </button>
            )
          })}
        </div>
      </div>

      <Button className="mt-6 w-full" variant="outline" onClick={onClearFilters}>
        <RotateCcw className="size-4" />
        重置筛选
      </Button>
    </aside>
  )
}
```

- [ ] **Step 3: Replace `MainContent.tsx` with editorial content**

Replace `src/components/home/MainContent.tsx` with:

```tsx
import { ArrowRight, Clock, Eye, Newspaper, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { type Announcement, type Category, type Post, type Tag } from "@/lib/blog-data"
import { cn } from "@/lib/utils"

type MainContentProps = {
  announcement: Announcement
  featuredPost: Post
  posts: Post[]
  totalPosts: number
  dense?: boolean
  activeCategory?: Category
  activeTag?: Tag
  query: string
  onClearFilters: () => void
}

const coverClasses: Record<Post["cover"]["accent"], string> = {
  teal: "from-[oklch(0.82_0.08_174)] to-[oklch(0.96_0.03_150)]",
  yellow: "from-[oklch(0.88_0.13_87)] to-[oklch(0.98_0.04_95)]",
  coral: "from-[oklch(0.72_0.15_28)] to-[oklch(0.95_0.05_35)]",
  ink: "from-foreground to-[oklch(0.36_0.02_72)] text-background",
}

/**
 * 渲染首页中间的策展内容和文章流。
 * @param props 精选文章、筛选后的文章和当前筛选信息
 */
export const MainContent = ({
  announcement,
  featuredPost,
  posts,
  totalPosts,
  dense = false,
  activeCategory,
  activeTag,
  query,
  onClearFilters,
}: MainContentProps) => {
  const hasFilters = Boolean(activeCategory || activeTag || query.trim())

  return (
    <section className="min-w-0 space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.7fr)]">
        <article className="relative min-h-[280px] overflow-hidden rounded-2xl border border-foreground bg-foreground p-6 text-background shadow-[8px_8px_0_rgba(25,25,25,0.12)]">
          <div className="relative z-10 max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-background/20 px-3 py-1 text-xs font-bold text-[oklch(0.88_0.13_87)]">
              <Sparkles className="size-3.5" />
              本周策展
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">{featuredPost.title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-background/72 sm:text-base">{featuredPost.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-background/70">
              <span>{featuredPost.category.name}</span>
              <span>{featuredPost.publishedAt}</span>
              <span>{featuredPost.readingTime}</span>
              <span>{featuredPost.views.toLocaleString()} views</span>
            </div>
          </div>
          <div className="absolute -bottom-12 right-6 size-44 rounded-full bg-[oklch(0.82_0.08_174)]" />
          <div className="absolute right-28 top-10 size-20 rounded-full border border-background/25" />
        </article>

        <aside className="rounded-2xl border border-foreground/15 bg-[oklch(0.88_0.13_87)] p-5 shadow-[6px_6px_0_rgba(25,25,25,0.08)]">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Newspaper className="size-4" />
            公告
          </p>
          <h2 className="mt-8 text-2xl font-black leading-tight">{announcement.title}</h2>
          <p className="mt-3 text-sm leading-6 text-foreground/70">{announcement.description}</p>
          <Button className="mt-8" variant="default">
            {announcement.actionLabel}
            <ArrowRight className="size-4" />
          </Button>
        </aside>
      </div>

      <div className="rounded-2xl border border-foreground/15 bg-card/80 p-4">
        <div className="flex flex-col gap-3 border-b border-foreground/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Article Stream</p>
            <h2 className="mt-1 text-2xl font-black">{dense ? "全部文章" : "最新写作"}</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            显示 {posts.length} / {totalPosts} 篇
            {activeCategory ? ` · ${activeCategory.name}` : ""}
            {activeTag ? ` · #${activeTag.name}` : ""}
            {query.trim() ? ` · “${query.trim()}”` : ""}
          </div>
        </div>

        {posts.length > 0 ? (
          <div className={cn("mt-4 grid gap-4", dense ? "md:grid-cols-2" : "xl:grid-cols-2")}>
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group min-h-[260px] rounded-2xl border border-foreground/10 bg-background p-4 transition hover:-translate-y-1 hover:border-foreground/40 hover:shadow-[6px_6px_0_rgba(25,25,25,0.08)]"
              >
                <div className={cn("flex h-28 items-end rounded-xl bg-gradient-to-br p-4", coverClasses[post.cover.accent])}>
                  <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-black text-foreground">{post.cover.label}</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border border-foreground/10 px-2 py-1">{post.category.name}</span>
                  <span>{post.publishedAt}</span>
                </div>
                <h3 className="mt-3 text-xl font-black leading-snug group-hover:underline">{post.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {post.readingTime}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="size-3.5" />
                    {post.views.toLocaleString()}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-foreground/20 bg-background p-10 text-center">
            <p className="text-xl font-black">没有找到匹配的文章</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              换一个关键词，或者重置分类和标签。这个空状态会在后续接真实搜索接口时继续复用。
            </p>
            {hasFilters ? (
              <Button className="mt-6" variant="outline" onClick={onClearFilters}>
                重置筛选
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Replace `RighTools.tsx` with right-side search/tools**

Replace `src/components/home/RighTools.tsx` with:

```tsx
import { Bookmark, Flame, Search, SlidersHorizontal, SunMedium } from "lucide-react"

import { Button } from "@/components/ui/button"
import { type Post } from "@/lib/blog-data"
import { cn } from "@/lib/utils"

type RightToolsProps = {
  className?: string
  query: string
  onQueryChange: (value: string) => void
  popularPosts: Post[]
  onSelectTag: (slug: string | undefined) => void
}

/**
 * 渲染右侧搜索、热门文章和阅读工具。
 * @param props 搜索词、热门文章和标签筛选回调
 */
export const RightTools = ({ className, query, onQueryChange, popularPosts, onSelectTag }: RightToolsProps) => {
  return (
    <aside className={cn("space-y-4 xl:sticky xl:top-20 xl:self-start", className)}>
      <section className="rounded-2xl border border-foreground/15 bg-card/80 p-4 shadow-[6px_6px_0_rgba(25,25,25,0.08)]">
        <label className="text-xs font-semibold uppercase text-muted-foreground" htmlFor="blog-search">
          Search
        </label>
        <div className="mt-3 flex h-11 items-center gap-2 rounded-xl border border-foreground/15 bg-background px-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            id="blog-search"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索标题、摘要、标签"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-foreground/15 bg-card/80 p-4">
        <h2 className="flex items-center gap-2 text-sm font-black">
          <Flame className="size-4 text-[oklch(0.72_0.15_28)]" />
          热门文章
        </h2>
        <div className="mt-4 space-y-3">
          {popularPosts.map((post, index) => (
            <button
              key={post.slug}
              type="button"
              onClick={() => onSelectTag(post.tags[0]?.slug)}
              className="flex w-full gap-3 rounded-xl border border-foreground/10 bg-background p-3 text-left transition hover:border-foreground/30"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-foreground text-xs font-black text-background">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{post.title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{post.views.toLocaleString()} views</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-foreground bg-[oklch(0.9_0.06_174)] p-4">
        <h2 className="text-sm font-black">阅读工具</h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button variant="outline" size="icon" aria-label="收藏">
            <Bookmark />
          </Button>
          <Button variant="outline" size="icon" aria-label="筛选">
            <SlidersHorizontal />
          </Button>
          <Button variant="outline" size="icon" aria-label="主题">
            <SunMedium />
          </Button>
        </div>
        <p className="mt-4 text-xs leading-5 text-foreground/70">这些入口先作为前台原型工具位，后续可以接收藏、目录和主题持久化。</p>
      </section>
    </aside>
  )
}
```

- [ ] **Step 5: Run scoped lint for home components**

Run:

```bash
npm run lint -- src/components/home
```

Expected: PASS with no ESLint errors in `src/components/home`.

- [ ] **Step 6: Commit Task 4**

Run:

```bash
git add src/components/home/BlogExperience.tsx src/components/home/LeftMenu.tsx src/components/home/MainContent.tsx src/components/home/RighTools.tsx
git commit -m "feat: build magazine blog components"
```

---

### Task 5: Wire Pages To The Prototype

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/home/page.tsx`
- Modify: `src/app/user/page.tsx`

- [ ] **Step 1: Wire `/` to the blog experience**

Replace `src/app/page.tsx` with:

```tsx
import { BlogExperience } from "@/components/home/BlogExperience"
import { allPosts, announcement, categories, tags } from "@/lib/blog-data"

export default function Home() {
  return <BlogExperience posts={allPosts} categories={categories} tags={tags} announcement={announcement} />
}
```

- [ ] **Step 2: Wire `/home` to the dense article browser**

Replace `src/app/home/page.tsx` with:

```tsx
import { BlogExperience } from "@/components/home/BlogExperience"
import { allPosts, announcement, categories, tags } from "@/lib/blog-data"

const HomePage = () => {
  return <BlogExperience dense posts={allPosts} categories={categories} tags={tags} announcement={announcement} />
}

export default HomePage
```

- [ ] **Step 3: Give `/user` a lightweight route**

Replace `src/app/user/page.tsx` with:

```tsx
import { BookMarked, PenLine, Rocket } from "lucide-react"

/**
 * 渲染轻量个人中心页面，作为后续登录和后台能力的入口。
 * @returns 用户中心前台占位页面
 */
const UserPage = () => {
  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-foreground/15 bg-card/85 p-6 shadow-[8px_8px_0_rgba(25,25,25,0.08)]">
      <p className="text-xs font-semibold uppercase text-muted-foreground">EuLa Studio</p>
      <h1 className="mt-3 text-4xl font-black leading-tight">个人中心会在后端方向确定后接入</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
        当前版本先专注前台阅读体验。这里保留为后续登录、收藏、草稿和后台管理的入口，不提前绑定具体认证方案。
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: BookMarked, title: "收藏", text: "预留文章收藏和阅读列表。" },
          { icon: PenLine, title: "草稿", text: "预留 Markdown 创作工作台。" },
          { icon: Rocket, title: "后台", text: "预留 Prisma 和 NextAuth 接入。" },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-foreground/10 bg-background p-4">
            <item.icon className="size-5" />
            <h2 className="mt-4 font-black">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default UserPage
```

- [ ] **Step 4: Run scoped lint for app routes**

Run:

```bash
npm run lint -- src/app/page.tsx src/app/home/page.tsx src/app/user/page.tsx
```

Expected: PASS with no ESLint errors in the modified page files.

- [ ] **Step 5: Commit Task 5**

Run:

```bash
git add src/app/page.tsx src/app/home/page.tsx src/app/user/page.tsx
git commit -m "feat: wire blog prototype pages"
```

---

### Task 6: Final Scoped Verification And Browser Inspection

**Files:**
- Verify only

- [ ] **Step 1: Run data helper tests again**

Run:

```bash
node --test src/lib/blog-data.test.ts
```

Expected: PASS with 4 tests passing.

- [ ] **Step 2: Run scoped ESLint for touched folders**

Run:

```bash
npm run lint -- src/app src/components src/lib
```

Expected: PASS with no ESLint errors in the touched folders.

- [ ] **Step 3: Start the Next.js dev server**

Run:

```bash
npm run dev -- --host 127.0.0.1 --port 3000
```

Expected: server starts and prints a local URL for `http://127.0.0.1:3000`.

- [ ] **Step 4: Inspect desktop UI in browser**

Open `http://127.0.0.1:3000`.

Expected:

- Header renders with EuLa Blog branding.
- Desktop layout shows left taxonomy rail, central article stream, and right tools rail.
- Search input filters posts locally.
- Category and tag clicks update the visible article stream.
- No visible text overlap in the first viewport.

- [ ] **Step 5: Inspect mobile UI in browser**

Use a mobile-width viewport on `http://127.0.0.1:3000`.

Expected:

- Header mobile menu opens and closes.
- Content becomes single-column.
- Cards, buttons, and labels do not overflow their containers.
- `/home` and `/user` render usable responsive layouts.

- [ ] **Step 6: Report build caveat**

Do not run `npm run build` unless the user explicitly asks, because `AGENTS.md` asks for scoped verification instead of full builds.

- [ ] **Step 7: Commit verification-only changes**

No commit is needed if verification does not modify files.

