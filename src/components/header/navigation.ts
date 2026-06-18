export type HeaderMenu = {
  name: string
  href: string
}

export const menus: HeaderMenu[] = [
  { name: "首页", href: "/" },
  { name: "文章", href: "/home" },
  { name: "归档", href: "/home?view=archive" },
  { name: "关于", href: "/user" },
]

/**
 * 拆分导航 href 中的路径和查询参数。
 * @param href 导航目标地址
 */
function splitHref(href: string) {
  const [path, query = ""] = href.split("?")

  return {
    path,
    query: new URLSearchParams(query),
  }
}

/**
 * 判断导航项是否应该处于当前高亮状态。
 * @param menu 导航项配置
 * @param pathname 当前路由路径
 * @param search 当前查询字符串，格式例如 "?view=archive"
 */
export function isMenuActive(menu: HeaderMenu, pathname: string, search: string) {
  const { path, query } = splitHref(menu.href)
  const currentQuery = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search)

  if (pathname !== path) {
    return false
  }

  const queryEntries = [...query.entries()]
  if (queryEntries.length > 0) {
    return queryEntries.every(([key, value]) => currentQuery.get(key) === value)
  }

  return !currentQuery.has("view")
}
