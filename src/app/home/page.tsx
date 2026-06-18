import { BlogExperience } from "@/components/home/BlogExperience"
import { allPosts, announcement, categories, tags } from "@/lib/blog-data"

type HomePageProps = {
  searchParams: Promise<{
    view?: string
  }>
}

/**
 * 渲染更密集的文章浏览或时间归档页面。
 * @param props URL 查询参数
 * @returns 文章浏览页面组件
 */
const HomePage = async ({ searchParams }: HomePageProps) => {
  const { view } = await searchParams
  const currentView = view === "archive" ? "archive" : "articles"

  return (
    <BlogExperience
      dense
      view={currentView}
      posts={allPosts}
      categories={categories}
      tags={tags}
      announcement={announcement}
    />
  )
}

export default HomePage
