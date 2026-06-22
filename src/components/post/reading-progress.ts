export type ReadingProgressInput = {
  scrollY: number
  scrollHeight: number
  clientHeight: number
}

/**
 * 根据页面滚动数据计算阅读进度百分比。
 * @param input 当前滚动距离、文档高度和视口高度
 */
export function calculateReadingProgress({ scrollY, scrollHeight, clientHeight }: ReadingProgressInput): number {
  // 根据传入的滚动高度和静态高度计算滚动条的进度
  const scrollableHeight = scrollHeight - clientHeight

  if (scrollableHeight <= 0) {
    return 100
  }

  const progress = (scrollY / scrollableHeight) * 100

  return Math.min(100, Math.max(0, Math.round(progress)))
}
