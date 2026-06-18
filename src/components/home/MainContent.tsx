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
          <div className="absolute -bottom-8 right-0 h-28 w-52 -rotate-6 rounded-tl-2xl bg-[oklch(0.82_0.08_174)]" />
          <div className="absolute right-20 top-10 h-16 w-28 rotate-6 rounded-xl border border-background/25" />
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
