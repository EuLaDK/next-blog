import { ArrowRight, BookOpen, LibraryBig, Search, Sparkles, Tags } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { announcement, type Post } from "@/lib/blog-data"
import { getBlogIndexData } from "@/lib/posts"

/**
 * 根据分类 slug 统计公开文章数量。
 * @param posts 文章列表
 * @param categorySlug 分类唯一标识
 */
function getCategoryCount(posts: Post[], categorySlug: string): number {
  return posts.filter((post) => post.category.slug === categorySlug).length
}

/**
 * 渲染博客门面首页，负责精选内容和进入文章浏览页。
 */
export default async function Home() {
  const { posts, categories } = await getBlogIndexData()

  return (
    <main className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <article className="relative min-h-[390px] overflow-hidden rounded-2xl border border-foreground bg-foreground p-6 text-background shadow-[8px_8px_0_rgba(25,25,25,0.12)] sm:p-8">
          <div className="relative z-10 max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-background/20 px-3 py-1 text-xs font-bold text-[oklch(0.88_0.13_87)]">
              <Sparkles className="size-3.5" />
              EuLa Blog
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">把学习过程写成可检索的阅读系统</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-background/72">
              这里收集 Next.js、React、工程化和界面设计笔记。首页负责精选和导读，文章页负责搜索、分类、标签和归档。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-background text-foreground hover:bg-background/90" variant="secondary">
                <Link href="/home">
                  浏览全部文章
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="border-[oklch(0.88_0.13_87)] bg-[oklch(0.88_0.13_87)] text-foreground hover:bg-[oklch(0.82_0.13_87)] hover:text-foreground"
                variant="outline"
              >
                <Link href="/home?view=archive">
                  <LibraryBig className="size-4" />
                  时间归档
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-background/15 bg-background/10 p-4">
                <p className="text-3xl font-black">{posts.length}</p>
                <p className="mt-1 text-xs font-semibold text-background/65">公开文章</p>
              </div>
              <div className="rounded-2xl border border-background/15 bg-background/10 p-4">
                <p className="text-3xl font-black">{categories.length}</p>
                <p className="mt-1 text-xs font-semibold text-background/65">主题分类</p>
              </div>
              <div className="rounded-2xl border border-background/15 bg-background/10 p-4">
                <p className="text-3xl font-black">DB</p>
                <p className="mt-1 text-xs font-semibold text-background/65">Prisma 内容源</p>
              </div>
            </div>
          </div>

          <div className="absolute -left-12 bottom-8 h-28 w-60 rotate-6 rounded-2xl border border-background/15" />
          <div className="absolute right-20 top-12 h-16 w-32 -rotate-6 rounded-xl bg-[oklch(0.88_0.13_87)]" />
          <div className="absolute bottom-8 right-8 hidden h-32 w-32 rounded-2xl border border-background/15 bg-background/10 lg:block" />
        </article>

        <aside className="grid gap-4">
          <section className="rounded-2xl border border-foreground/15 bg-[oklch(0.88_0.13_87)] p-5 shadow-[6px_6px_0_rgba(25,25,25,0.08)]">
            <p className="flex items-center gap-2 text-sm font-bold">
              <BookOpen className="size-4" />
              {announcement.title}
            </p>
            <p className="mt-4 text-sm leading-7 text-foreground/72">{announcement.description}</p>
            <Button asChild className="mt-5" variant="default">
              <Link href="/plan">
                {announcement.actionLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </section>

          <section className="rounded-2xl border border-foreground/15 bg-card/80 p-5">
            <p className="flex items-center gap-2 text-sm font-black">
              <Search className="size-4" />
              快速进入
            </p>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/home?focus=search">搜索文章</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/home?view=archive">按时间阅读</Link>
              </Button>
            </div>
          </section>
        </aside>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-foreground/15 bg-card/80 p-4">
          <div className="flex flex-col gap-2 border-b border-foreground/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Reading Paths</p>
              <h2 className="mt-1 text-2xl font-black">从主题开始</h2>
            </div>
            <Button asChild variant="ghost">
              <Link href="/home">
                进入文章浏览
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/home?category=${category.slug}`}
                className="group min-h-[170px] rounded-2xl border border-foreground/10 bg-background p-4 transition hover:-translate-y-1 hover:border-foreground/35"
              >
                <p className="text-xs font-bold uppercase text-muted-foreground">{category.slug}</p>
                <h3 className="mt-3 text-2xl font-black leading-tight group-hover:underline">{category.name}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
                <p className="mt-5 text-xs font-bold text-muted-foreground">{getCategoryCount(posts, category.slug)} 篇文章</p>
              </Link>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-foreground/15 bg-card/80 p-4">
            <h2 className="flex items-center gap-2 text-sm font-black">
              <Tags className="size-4" />
              分类入口
            </h2>
            <div className="mt-4 grid gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/home?category=${category.slug}`}
                  className="flex items-center justify-between rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm transition hover:border-foreground/35"
                >
                  <span className="font-bold">{category.name}</span>
                  <span className="text-xs text-muted-foreground">{getCategoryCount(posts, category.slug)}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-foreground/15 bg-[oklch(0.9_0.06_174)] p-4">
            <h2 className="text-sm font-black">阅读方式</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <Link href="/home?focus=search" className="rounded-xl bg-background/70 p-3 font-bold transition hover:bg-background">
                搜索关键词
              </Link>
              <Link href="/home?view=archive" className="rounded-xl bg-background/70 p-3 font-bold transition hover:bg-background">
                查看时间归档
              </Link>
              <Link href="/home" className="rounded-xl bg-background/70 p-3 font-bold transition hover:bg-background">
                浏览全部文章
              </Link>
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}
