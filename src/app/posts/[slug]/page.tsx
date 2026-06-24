import { notFound } from "next/navigation"

import { PostPreview } from "@/components/post/PostPreview"
import { allPosts, getAdjacentPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog-data"

type PostPageProps = {
  params: Promise<{
    slug: string
  }>
}

/**
 * 生成 mock 文章详情页的静态参数。
 * @returns 可预览文章的 slug 列表
 */
export function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

/**
 * 渲染文章详情预览页面。
 * @param props 动态路由参数
 */
const PostPage = async ({ params }: PostPageProps) => {
  const { slug } = await params
  const post = getPostBySlug(allPosts, slug)
  if (!post) {
    notFound()
  }

  const { previous, next } = getAdjacentPosts(allPosts, post.slug)
  const relatedPosts = getRelatedPosts(allPosts, post, 3)
  return <PostPreview post={post} previous={previous} next={next} relatedPosts={relatedPosts} />
}

export default PostPage
