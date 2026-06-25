import { ArrowLeft, ArrowRight, Clock, Eye, Hash, PenLine } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PostToc } from "@/components/post/PostToc"
import { ReadingProgress } from "@/components/post/ReadingProgress"
import { getPostSectionId } from "@/components/post/post-sections"
import { type Post } from "@/lib/blog-data"
import { cn } from "@/lib/utils"

type PrevNext = {
  slug: string
  title: string
}

type PostPreviewProps = {
  post: Post
  previous: PrevNext | null
  next: PrevNext | null
  relatedPosts: Post[]
}

const coverClasses: Record<Post["cover"]["accent"], string> = {
  teal: "from-[oklch(0.82_0.08_174)] to-[oklch(0.96_0.03_150)]",
  yellow: "from-[oklch(0.88_0.13_87)] to-[oklch(0.98_0.04_95)]",
  coral: "from-[oklch(0.72_0.15_28)] to-[oklch(0.95_0.05_35)]",
  ink: "from-foreground to-[oklch(0.36_0.02_72)] text-background",
}

/**
 * 渲染文章详情阅读预览页。
 * @param props 当前文章、上一篇/下一篇和相关文章
 */
export const PostPreview = ({ post, previous, next, relatedPosts }: PostPreviewProps) => {
  return (
    <>
      <ReadingProgress />
      <article className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <section className="overflow-hidden rounded-2xl border border-foreground bg-foreground text-background shadow-[8px_8px_0_rgba(25,25,25,0.12)]">
            <div className={cn("h-52 bg-gradient-to-br p-5", coverClasses[post.cover.accent])}>
              <Button asChild variant="outline" size="sm" className="border-background/50 bg-background/85 text-foreground hover:bg-background">
                <Link href="/home">
                  <ArrowLeft className="size-4" />
                  返回文章
                </Link>
              </Button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-background/70">
                <span className="rounded-full border border-background/20 px-3 py-1">{post.category.name}</span>
                <span>{post.publishedAt}</span>
                <span>{post.readingTime}</span>
                <span>{post.views.toLocaleString()} views</span>
              </div>

              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">{post.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-background/74">{post.excerpt}</p>

              <div className="mt-8 flex items-center gap-3 border-t border-background/15 pt-5">
                <span className="grid size-11 place-items-center rounded-xl bg-background text-sm font-black text-foreground">
                  {post.author.avatarInitials}
                </span>
                <div>
                  <p className="font-bold">{post.author.name}</p>
                  <p className="text-sm text-background/60">{post.author.title}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-foreground/15 bg-card/85 p-5 sm:p-8">
            <div className="mx-auto max-w-3xl space-y-8">
              {post.sections.map((section, index) => (
                <section key={section.title} id={getPostSectionId(index)} className="scroll-mt-24">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">0{index + 1}</p>
                  <h2 className="mt-2 text-2xl font-black">{section.title}</h2>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">{section.body}</p>
                </section>
              ))}
            </div>
          </section>

          <nav className="grid gap-4 md:grid-cols-2">
            {previous ? (
              <Link
                href={`/posts/${previous.slug}`}
                className="rounded-2xl border border-foreground/15 bg-card/85 p-4 transition hover:-translate-y-0.5 hover:border-foreground/35"
              >
                <p className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <ArrowLeft className="size-3.5" />
                  上一篇
                </p>
                <h2 className="mt-3 font-black leading-snug">{previous.title}</h2>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-foreground/15 bg-card/60 p-4 text-sm text-muted-foreground">已经是第一篇</div>
            )}

            {next ? (
              <Link
                href={`/posts/${next.slug}`}
                className="rounded-2xl border border-foreground/15 bg-card/85 p-4 text-right transition hover:-translate-y-0.5 hover:border-foreground/35"
              >
                <p className="flex items-center justify-end gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  下一篇
                  <ArrowRight className="size-3.5" />
                </p>
                <h2 className="mt-3 font-black leading-snug">{next.title}</h2>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-foreground/15 bg-card/60 p-4 text-right text-sm text-muted-foreground">
                已经是最后一篇
              </div>
            )}
          </nav>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <PostToc sections={post.sections} />

          <section className="rounded-2xl border border-foreground/15 bg-card/85 p-4">
            <h2 className="flex items-center gap-2 text-sm font-black">
              <PenLine className="size-4" />
              文章信息
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Clock className="size-4" />
                {post.readingTime}
              </span>
              <span className="flex items-center gap-2">
                <Eye className="size-4" />
                {post.views.toLocaleString()} 次阅读
              </span>
              <span className="flex items-center gap-2">
                <Hash className="size-4" />
                {post.tags.map((tag) => tag.name).join(" / ")}
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-foreground/15 bg-[oklch(0.9_0.06_174)] p-4">
            <h2 className="text-sm font-black">相关推荐</h2>
            <div className="mt-4 space-y-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/posts/${relatedPost.slug}`}
                  className="block rounded-xl border border-foreground/10 bg-background/70 p-3 transition hover:border-foreground/35"
                >
                  <p className="truncate text-sm font-bold">{relatedPost.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{relatedPost.category.name}</p>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </article>
    </>
  )
}
