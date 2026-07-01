"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArchiveTimeline } from "@/components/home/ArchiveTimeline"
import { LeftMenu } from "@/components/home/LeftMenu"
import { MainContent } from "@/components/home/MainContent"
import { RightTools } from "@/components/home/RighTools"
import {
  type Announcement,
  type Category,
  type Post,
  type Tag,
  filterPosts,
  getArchiveGroups,
  getFeaturedPost,
  getPopularPosts,
} from "@/lib/blog-data"

export type BlogExperienceProps = {
  posts: Post[]
  categories: Category[]
  tags: Tag[]
  announcement: Announcement
  dense?: boolean
  view?: "articles" | "archive"
  initialQuery?: string
  initialCategorySlug?: string
  initialTagSlug?: string
}


/**
 * 管理前台博客的本地搜索、分类和标签筛选状态。
 * @param props 博客文章、分类、标签和公告数据
 */
export const BlogExperience = ({
  posts,
  categories,
  tags,
  announcement,
  dense = false,
  view = "articles",
  initialQuery = "",
  initialCategorySlug,
  initialTagSlug,
}: BlogExperienceProps) => {
  const [query, setQuery] = useState(initialQuery)
  const [categorySlug, setCategorySlug] = useState<string | undefined>(initialCategorySlug)
  const [tagSlug, setTagSlug] = useState<string | undefined>(initialTagSlug)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 当筛选条件变化时，更新 URL 查询参数

  const featuredPost = getFeaturedPost(posts)
  const popularPosts = getPopularPosts(posts, 4)
  const filteredPosts = useMemo(
    () => filterPosts(posts, { query, categorySlug, tagSlug }),
    [categorySlug, posts, query, tagSlug],
  )
  const archiveGroups = useMemo(() => getArchiveGroups(filteredPosts), [filteredPosts])
  /**
   * 清空所有本地筛选条件。
   */
  const updateUrl = (next: {
    q?: string
    category?: string
    tag?: string
    view?: string
  }) => {
    const params = new URLSearchParams(searchParams.toString())
    if (next.q !== undefined) {
      if (next.q) {
        params.set("q", next.q)
      } else {
        params.delete("q")
      }
    }
    if (next.category !== undefined) {
      if (next.category) {
        params.set("category", next.category)
      } else {
        params.delete("category")
      }
    }
    if (next.tag !== undefined) {
      if (next.tag) {
        params.set("tag", next.tag)
      } else {
        params.delete("tag")
      }
    }
    if (next.view !== undefined) {
      if (next.view) {
        params.set("view", next.view)
      } else {
        params.delete("view")
      }
    }

    const queryString = params.toString()
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
  }
  const clearFilters = () => {
    setQuery("")
    setCategorySlug(undefined)
    setTagSlug(undefined)

    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    params.delete("category")
    params.delete("tag")

    const queryString = params.toString()
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_300px]">
      <LeftMenu
        categories={categories}
        tags={tags}
        posts={posts}
        activeCategorySlug={categorySlug}
        activeTagSlug={tagSlug}
        onSelectCategory={(slug) => {
          setCategorySlug(slug)
          updateUrl({ category: slug})
        }}
        onSelectTag={(slug) => {
          setTagSlug(slug)
          updateUrl({ tag: slug})
        }}
        onClearFilters={clearFilters}
      />
      {view === "archive" ? (
        <ArchiveTimeline
          archiveGroups={archiveGroups}
          totalPosts={posts.length}
          activeCategory={categories.find((category) => category.slug === categorySlug)}
          activeTag={tags.find((tag) => tag.slug === tagSlug)}
          query={query}
          onClearFilters={clearFilters}
        />
      ) : (
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
      )}
      <RightTools
        className="lg:col-span-2 xl:col-span-1"
        query={query}
        onQueryChange={(value) => {
          setQuery(value)
          updateUrl({ q: value})
        }}
        popularPosts={popularPosts}
      />
    </div>
  )
}
