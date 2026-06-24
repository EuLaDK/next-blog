import { BlogExperience } from "@/components/home/BlogExperience"
import { announcement } from "@/lib/blog-data"
import { getBlogIndexData } from "@/lib/posts"

type HomePageProps = {
  searchParams: Promise<{
    view?: string
    q?: string
    category?: string
    tag?: string
  }>
}

/**
 * 渲染更密集的文章浏览或时间归档页面。
 * @param props URL 查询参数
 * @returns 文章浏览页面组件
 */
const HomePage = async ({ searchParams }: HomePageProps) => {
  const { view, q, category, tag } = await searchParams
  const currentView = view === "archive" ? "archive" : "articles"
  const { posts, categories, tags } = await getBlogIndexData()

  return (
    <BlogExperience
      dense
      view={currentView}
      posts={posts}
      categories={categories}
      tags={tags}
      announcement={announcement}
      initialQuery={q}
      initialCategorySlug={category}
      initialTagSlug={tag}
    />
  )
}

export default HomePage
