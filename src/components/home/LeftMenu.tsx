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
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-bold",
                  active ? "bg-background text-foreground" : accentClasses[category.accent],
                )}
              >
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
