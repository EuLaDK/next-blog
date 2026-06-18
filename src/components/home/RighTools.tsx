import { Bookmark, Flame, Search, SlidersHorizontal, SunMedium } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { type Post } from "@/lib/blog-data"
import { cn } from "@/lib/utils"

type RightToolsProps = {
  className?: string
  query: string
  onQueryChange: (value: string) => void
  popularPosts: Post[]
}

/**
 * 渲染右侧搜索、热门文章和阅读工具。
 * @param props 搜索词、热门文章和标签筛选回调
 */
export const RightTools = ({ className, query, onQueryChange, popularPosts }: RightToolsProps) => {
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
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="flex w-full gap-3 rounded-xl border border-foreground/10 bg-background p-3 text-left transition hover:border-foreground/30"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-foreground text-xs font-black text-background">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{post.title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{post.views.toLocaleString()} views</span>
              </span>
            </Link>
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
