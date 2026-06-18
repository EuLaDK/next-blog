"use client"

import { useMemo, useState } from "react"

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
}

/**
 * 管理前台博客的本地搜索、分类和标签筛选状态。
 * @param props 博客文章、分类、标签和公告数据
 */
export const BlogExperience = ({ posts, categories, tags, announcement, dense = false, view = "articles" }: BlogExperienceProps) => {
  const [query, setQuery] = useState("")
  const [categorySlug, setCategorySlug] = useState<string>()
  const [tagSlug, setTagSlug] = useState<string>()

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
        onQueryChange={setQuery}
        popularPosts={popularPosts}
      />
    </div>
  )
}
