import { notFound } from "next/navigation"

import { PostPreview } from "@/components/post/PostPreview"
import { mapPrismaPostToBlogPost } from '@/lib/posts'
import prisma from '@/lib/prisma'

type PostPageProps = {
  params: Promise<{
    slug: string
  }>
}

const selected = {
  slug: true,
  title: true
}

// 封装查询函数
const getParamsPostData = async (slug: string) => {
  try {
    const currentArticle = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })
    if (!currentArticle) {
      return { current: null, prev: null, next: null}
    }
    const [prevArticle, nextArticle] = await Promise.all([
      // 查询上一篇根据时间排序
      prisma.post.findFirst({
        where: {
          createdAt: { lt: currentArticle.createdAt }, // 小于当前时间
        },
        orderBy: {
          createdAt: 'desc', // 降序排序
        },
        select: selected
      }),
      // 查询下一篇
      prisma.post.findFirst({
        where: {
          createdAt: { gt: currentArticle.createdAt } // 大于当前时间
        },
        orderBy: {
          createdAt: 'asc', // 升序
        },
        select: selected
      })
    ])
    return {
      post: mapPrismaPostToBlogPost(currentArticle),
      prev: prevArticle,
      next: nextArticle
    }
  } catch {
    throw new Error('查询失败')
  }
}

/**
 * 渲染文章详情预览页面。
 * @param props 动态路由参数
 */
const PostPage = async ({ params }: PostPageProps) => {
  // 获取路由上的文章名称
  const { slug } = await params
  // 根据slug查询对应的文章
  const { post, prev, next } = await getParamsPostData(slug)
  if (!post) {
    notFound()
  }
  // const { previous, next } = getAdjacentPosts(allPosts, post.slug)
  // const relatedPosts = getRelatedPosts(allPosts, post, 3)
  return <PostPreview post={post} previous={prev} next={next} relatedPosts={[]} />
}

export default PostPage
