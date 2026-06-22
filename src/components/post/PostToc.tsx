"use client"

import { BookOpen } from "lucide-react"
import { useEffect, useState } from "react"

import { getPostSectionId } from "@/components/post/post-sections"
import { type Post } from "@/lib/blog-data"
import { cn } from "@/lib/utils"

type PostTocProps = {
  sections: Post["sections"]
}

/**
 * 渲染文章目录，并在滚动阅读时高亮当前章节。
 * @param props 文章正文段落列表
 */
export const PostToc = ({ sections }: PostTocProps) => {
  const [activeSectionId, setActiveSectionId] = useState(() => getPostSectionId(0))

  useEffect(() => {
    const sectionElements = sections
      .map((_, index) => document.getElementById(getPostSectionId(index)))
      .filter((element): element is HTMLElement => Boolean(element))

    if (sectionElements.length === 0 || !("IntersectionObserver" in window)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0]

        if (visibleEntry?.target.id) {
          setActiveSectionId(visibleEntry.target.id)
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0.1,
      },
    )

    sectionElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [sections])

  return (
    <section className="rounded-2xl border border-foreground/15 bg-card/85 p-4 shadow-[6px_6px_0_rgba(25,25,25,0.08)]">
      <h2 className="flex items-center gap-2 text-sm font-black">
        <BookOpen className="size-4" />
        阅读目录
      </h2>
      <div className="mt-4 space-y-2">
        {sections.map((section, index) => {
          const sectionId = getPostSectionId(index)
          const active = activeSectionId === sectionId

          return (
            <a
              key={section.title}
              href={`#${sectionId}`}
              className={cn(
                "block rounded-xl border px-3 py-2 text-sm transition hover:border-foreground/35",
                active ? "border-foreground bg-foreground text-background" : "border-foreground/10 bg-background",
              )}
            >
              {section.title}
            </a>
          )
        })}
      </div>
    </section>
  )
}
