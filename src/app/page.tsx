import { BlogExperience } from "@/components/home/BlogExperience"
import { allPosts, announcement, categories, tags } from "@/lib/blog-data"

/**
 * 渲染杂志策展式博客首页。
 * @returns 博客首页页面组件
 */
export default function Home() {
  return <BlogExperience posts={allPosts} categories={categories} tags={tags} announcement={announcement} />
}
