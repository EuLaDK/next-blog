import { BlogExperience } from "@/components/home/BlogExperience"
import { allPosts, announcement, categories, tags } from "@/lib/blog-data"

/**
 * 渲染更密集的文章浏览页面。
 * @returns 文章浏览页面组件
 */
const HomePage = () => {
  return <BlogExperience dense posts={allPosts} categories={categories} tags={tags} announcement={announcement} />
}

export default HomePage
