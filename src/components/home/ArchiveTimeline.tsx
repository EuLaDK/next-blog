import { CalendarDays, Clock, Eye, RotateCcw } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { type ArchiveYearGroup, type Category, type Tag } from "@/lib/blog-data"

type ArchiveTimelineProps = {
  archiveGroups: ArchiveYearGroup[]
  totalPosts: number
  activeCategory?: Category
  activeTag?: Tag
  query: string
  onClearFilters: () => void
}

/**
 * 渲染文章归档的时间轨道视图。
 * @param props 归档分组、筛选状态和重置回调
 */
export const ArchiveTimeline = ({
  archiveGroups,
  totalPosts,
  activeCategory,
  activeTag,
  query,
  onClearFilters,
}: ArchiveTimelineProps) => {
  const visiblePosts = archiveGroups.reduce(
    (count, yearGroup) => count + yearGroup.months.reduce((monthCount, monthGroup) => monthCount + monthGroup.posts.length, 0),
    0,
  )
  const hasFilters = Boolean(activeCategory || activeTag || query.trim())

  return (
    <section className="min-w-0 space-y-4">
      <div className="rounded-2xl border border-foreground bg-foreground p-6 text-background shadow-[8px_8px_0_rgba(25,25,25,0.12)]">
        <p className="inline-flex items-center gap-2 rounded-full border border-background/20 px-3 py-1 text-xs font-bold text-[oklch(0.88_0.13_87)]">
          <CalendarDays className="size-3.5" />
          Archive Track
        </p>
        <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">时间轨道</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-background/72">
          按发布时间重新排列所有文章，让写作路线像一条可扫描的知识轨道。
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs text-background/70">
          <span>显示 {visiblePosts} / {totalPosts} 篇</span>
          {activeCategory ? <span>{activeCategory.name}</span> : null}
          {activeTag ? <span>#{activeTag.name}</span> : null}
          {query.trim() ? <span>“{query.trim()}”</span> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-foreground/15 bg-card/85 p-4 sm:p-6">
        {archiveGroups.length > 0 ? (
          <div className="space-y-8">
            {archiveGroups.map((yearGroup) => (
              <section key={yearGroup.year} className="grid gap-4 lg:grid-cols-[120px_minmax(0,1fr)]">
                <div>
                  <div className="sticky top-24 rounded-xl border border-foreground bg-foreground px-4 py-3 text-center text-2xl font-black text-background">
                    {yearGroup.year}
                  </div>
                </div>

                <div className="space-y-5 border-l border-foreground/20 pl-4 sm:pl-6">
                  {yearGroup.months.map((monthGroup) => (
                    <section key={monthGroup.month} className="relative">
                      <div className="absolute -left-[25px] top-1 h-8 w-3 rounded-sm bg-[oklch(0.88_0.13_87)] sm:-left-[33px]" />
                      <h2 className="text-xl font-black">{monthGroup.label}</h2>
                      <div className="mt-3 space-y-3">
                        {monthGroup.posts.map((post) => (
                          <Link
                            key={post.slug}
                            href={`/posts/${post.slug}`}
                            className="grid gap-3 rounded-2xl border border-foreground/10 bg-background p-4 transition hover:-translate-y-0.5 hover:border-foreground/35 hover:shadow-[6px_6px_0_rgba(25,25,25,0.08)] md:grid-cols-[92px_minmax(0,1fr)_auto]"
                          >
                            <div className="text-sm font-black">{post.publishedAt.slice(5)}</div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span className="rounded-full border border-foreground/10 px-2 py-1">{post.category.name}</span>
                                {post.tags.map((tag) => (
                                  <span key={tag.slug}>#{tag.name}</span>
                                ))}
                              </div>
                              <h3 className="mt-2 text-lg font-black leading-snug">{post.title}</h3>
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground md:flex-col md:items-end md:justify-center md:gap-2">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="size-3.5" />
                                {post.readingTime}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Eye className="size-3.5" />
                                {post.views.toLocaleString()}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-foreground/20 bg-background p-10 text-center">
            <p className="text-xl font-black">这条时间轨道暂时没有文章</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">换个关键词，或者重置分类和标签后继续浏览归档。</p>
            {hasFilters ? (
              <Button className="mt-6" variant="outline" onClick={onClearFilters}>
                <RotateCcw className="size-4" />
                重置筛选
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
