"use client"

import { useEffect, useState } from "react"

import { calculateReadingProgress } from "@/components/post/reading-progress"

/**
 * 渲染文章详情页顶部的阅读进度条。
 * @returns 阅读进度条组件
 */
export const ReadingProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    /**
     * 根据当前页面滚动位置刷新阅读进度。
     */
    const updateProgress = () => {
      setProgress(
        calculateReadingProgress({
          scrollY: window.scrollY,
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: window.innerHeight,
        }),
      )
    }

    // 更新页面的滚动条的显示距离
    updateProgress()
    // 添加浏览器的滚动事件，如果变动了就执行更新函数
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)

    return () => {
      // 返回一个清理函数，这个函数会在每次页面挂载前执行一次，把添加的事件全部移除
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [])

  return (
    <div className="fixed left-0 top-16 z-50 h-1 w-full bg-foreground/10" aria-hidden="true">
      <div
        className="h-full bg-[oklch(0.88_0.13_87)] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
