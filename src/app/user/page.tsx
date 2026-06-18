import { BookMarked, PenLine, Rocket } from "lucide-react"

const studioCards = [
  { icon: BookMarked, title: "收藏", text: "预留文章收藏和阅读列表。" },
  { icon: PenLine, title: "草稿", text: "预留 Markdown 创作工作台。" },
  { icon: Rocket, title: "后台", text: "预留 Prisma 和 NextAuth 接入。" },
]

/**
 * 渲染轻量个人中心页面，作为后续登录和后台能力的入口。
 * @returns 用户中心前台页面
 */
const UserPage = () => {
  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-foreground/15 bg-card/85 p-6 shadow-[8px_8px_0_rgba(25,25,25,0.08)]">
      <p className="text-xs font-semibold uppercase text-muted-foreground">EuLa Studio</p>
      <h1 className="mt-3 text-4xl font-black leading-tight">个人中心会在后端方向确定后接入</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
        当前版本先专注前台阅读体验。这里保留为后续登录、收藏、草稿和后台管理的入口，不提前绑定具体认证方案。
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {studioCards.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.title} className="rounded-2xl border border-foreground/10 bg-background p-4">
              <Icon className="size-5" />
              <h2 className="mt-4 font-black">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default UserPage
