import { notFound } from "next/navigation"

import { PostPreview } from "@/components/post/PostPreview"
import { getPostDetailBySlug } from "@/lib/posts"

type PostPageProps = {
  params: Promise<{
    slug: string
  }>
}

/**
 * 渲染文章详情预览页面。
 * @param props 动态路由参数
 */
const PostPage = async ({ params }: PostPageProps) => {
  const { slug } = await params
  const postDetail = await getPostDetailBySlug(slug)

  if (!postDetail) {
    notFound()
  }

  return (
    <PostPreview
      post={postDetail.post}
      previous={postDetail.previous}
      next={postDetail.next}
      relatedPosts={postDetail.relatedPosts}
    />
  )
}

export default PostPage
