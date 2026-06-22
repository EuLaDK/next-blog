
import { ArrowRight, CheckCircle2, FileText, Map, PenLine, Rocket, Sparkles } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const roadmapItems = [
  {
    title: "前台打磨",
    description: "完善导航入口、搜索筛选、归档浏览、文章预览和移动端细节。",
    status: "当前",
    practice: "Header / Filter / Archive",
    icon: Sparkles,
    accentClassName: "bg-[oklch(0.9_0.06_174)] text-foreground",
  },
  {
    title: "内容层",
    description: "把 mock 数据逐步替换成本地 Markdown，让文章来源更接近真实博客。",
    status: "下一步",
    practice: "Markdown / Static Params",
    icon: FileText,
    accentClassName: "bg-[oklch(0.88_0.13_87)] text-foreground",
  },
  {
    title: "后台管理",
    description: "先搭建内容工作台壳子，再接草稿、发布、分类标签和编辑能力。",
    status: "后续",
    practice: "Studio / Drafts / CRUD",
    icon: PenLine,
    accentClassName: "bg-[oklch(0.76_0.14_28)] text-white",
  },
  {
    title: "部署上线",
    description: "补齐 SEO、构建检查、部署流程和后续数据库服务的上线准备。",
    status: "最后",
    practice: "SEO / Build / Deploy",
    icon: Rocket,
    accentClassName: "bg-foreground text-background",
  },
]

const nextTasks = ["让 Header 的写作计划入口稳定可用", "把首页筛选状态同步到 URL", "把文章详情正文改成按文章数据渲染"]

/**
 * 渲染博客开发路线的静态计划页面。
 * @returns 写作计划页面组件
 */
const PlanPage = () => {
  return (
    <section className="mx-auto max-w-6xl space-y-4">
      <div className="rounded-2xl border border-foreground bg-foreground p-6 text-background shadow-[8px_8px_0_rgba(25,25,25,0.12)] sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-background/20 px-3 py-1 text-xs font-bold text-[oklch(0.88_0.13_87)]">
          <Map className="size-3.5" />
          Project Roadmap
        </p>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">写作计划</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-background/72 sm:text-base">
              先把博客前台原型打磨成完整阅读体验，再逐步进入 Markdown 内容层、后台管理和部署上线。这个页面先作为路线入口，后续功能由你继续补齐。
            </p>
          </div>
          <div className="rounded-2xl border border-background/15 bg-background/8 p-4">
            <p className="text-xs font-semibold uppercase text-background/55">Current Focus</p>
            <p className="mt-2 text-2xl font-black">前台体验</p>
            <p className="mt-2 text-sm leading-6 text-background/65">导航、筛选、归档和文章详情先跑顺。</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {roadmapItems.map((item) => {
          const Icon = item.icon

          return (
            <Card
              key={item.title}
              className="min-h-[220px] border-foreground/15 bg-card/85 py-0 transition hover:-translate-y-0.5 hover:border-foreground/35 hover:shadow-[6px_6px_0_rgba(25,25,25,0.08)]"
            >
              <CardHeader className="p-5 pb-0">
                <div className="flex items-start justify-between gap-3">
                  <span className={cn("grid size-11 place-items-center rounded-xl", item.accentClassName)}>
                    <Icon className="size-5" />
                  </span>
                  <span className="rounded-full border border-foreground/10 bg-background/70 px-2.5 py-1 text-xs font-bold">
                    {item.status}
                  </span>
                </div>
                <CardTitle className="mt-5 text-xl font-black leading-tight">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col px-5 pb-5">
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <p className="mt-auto pt-5 text-xs font-semibold uppercase text-muted-foreground">{item.practice}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl border border-foreground/15 bg-card/85 p-5">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Next Action</p>
          <h2 className="mt-2 text-2xl font-black">接下来先补功能，不再纠结页面长相</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            静态样式已经在这个页面里搭好，后续你可以按文档里的功能路线逐项实现，把注意力放在 Next.js 路由、组件边界和数据流上。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/home">
                回到文章
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/home?view=archive">查看归档</Link>
            </Button>
          </div>
        </section>

        <aside className="rounded-2xl border border-foreground/15 bg-[oklch(0.9_0.06_174)] p-5">
          <h2 className="text-sm font-black">功能练习顺序</h2>
          <div className="mt-4 space-y-3">
            {nextTasks.map((task) => (
              <div key={task} className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-background/70 p-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-foreground text-background">
                  <CheckCircle2 className="size-4" />
                </span>
                <p className="text-sm font-bold leading-6">{task}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default PlanPage
