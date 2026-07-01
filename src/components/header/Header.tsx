"use client"

import { Menu, Moon, Search, Sparkles, User, X, LogIn, LogOut } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isMenuActive, menus } from "@/components/header/navigation"
import { LoginDialog } from '@/components/login/Login'
import { cn } from "@/lib/utils"

/**
 * 渲染博客全局顶部导航，并在移动端提供折叠菜单。
 * @returns 博客头部导航组件
 */
export const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const search = searchParams.toString() ? `?${searchParams.toString()}` : ""
  const loginQuery = searchParams.get("login")
  const nextPath = searchParams.get("next")
  const loginDialogOpen = isLoginOpen || loginQuery === "1"

  /**
   * 切换页面路由，并在移动端导航后关闭菜单。
   * @param href 目标页面路径
   */
  const handleNavigate = (href: string, focus?: boolean) => {
    const url = focus ? `${href}?focus=${focus}` : href
    router.push(url)
    setMobileOpen(false)
  }

  /**
   * 关闭登录弹窗，并在取消登录时清理 URL 上的登录提示参数。
   * @param open 弹窗是否打开
   */
  const handleLoginOpenChange = (open: boolean) => {
    setIsLoginOpen(open)

    if (!open && loginQuery === "1") {
      const nextSearchParams = new URLSearchParams(searchParams.toString())
      nextSearchParams.delete("login")
      nextSearchParams.delete("next")

      const cleanUrl = nextSearchParams.toString() ? `${pathname}?${nextSearchParams.toString()}` : pathname
      router.replace(cleanUrl, { scroll: false })
    }
  }

  /**
   * 登录成功后跳回 proxy 记录的原始访问路径。
   */
  const handleLoginSuccess = () => {
    setIsLoginOpen(false)

    if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
      router.replace(nextPath)
      return
    }

    const nextSearchParams = new URLSearchParams(searchParams.toString())
    nextSearchParams.delete("login")
    nextSearchParams.delete("next")
    const cleanUrl = nextSearchParams.toString() ? `${pathname}?${nextSearchParams.toString()}` : pathname

    router.replace(cleanUrl, { scroll: false })
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-foreground/15 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          className="flex items-center gap-3 text-left"
          type="button"
          onClick={() => handleNavigate("/")}
          aria-label="回到首页"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-foreground text-background shadow-[4px_4px_0_rgba(0,0,0,0.12)]">
            <Sparkles className="size-5" />
          </span>
          <span>
            <span className="block text-lg font-black leading-none tracking-normal">EuLa Blog</span>
            <span className="text-xs text-muted-foreground">Next.js reading studio</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-foreground/15 bg-card/70 p-1 lg:flex">
          {menus.map((item) => {
            const active = isMenuActive(item, pathname, search)

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  "h-9 rounded-full px-4 text-sm font-medium transition hover:bg-muted",
                  active && "bg-foreground text-background hover:bg-foreground",
                )}
              >
                {item.name}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button className="hidden sm:inline-flex" variant="outline" size="icon" aria-label="搜索" onClick={() => handleNavigate('/home', true)}>
            <Search />
          </Button>
          <Button className="hidden sm:inline-flex" variant="outline" size="icon" aria-label="切换主题">
            <Moon />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="用户菜单">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>EuLa Studio</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleNavigate("/user")}>个人资料</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/home")}>文章列表</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate('/plan')}>写作计划</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
                <DropdownMenuItem className="text-blue-500" onSelect={() => setIsLoginOpen(true)}>
                      <LogIn />登录  
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                <LogOut />退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="lg:hidden"
            variant="outline"
            size="icon"
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-foreground/10 bg-background/95 px-4 py-3 lg:hidden">
          <nav className="grid gap-2">
            {menus.map((item) => {
              const active = isMenuActive(item, pathname, search)
              return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  "h-11 rounded-xl border border-foreground/10 bg-card px-4 text-left text-sm font-medium",
                  active && "bg-foreground text-background hover:bg-foreground",
                )}
              >
                {item.name}
              </button>
            )})}
          </nav>
        </div>
      ) : null}
      </header>
      <LoginDialog open={loginDialogOpen} onOpenChange={handleLoginOpenChange} onLoginSuccess={handleLoginSuccess} />
    </>
  )
}
