import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    const posts = await prisma.post.findMany({
        skip: 0, // 根据传过来的页数跳过一定的数据
        take: 10, // 十条
        include: { // include.author，会顺带把对应的 User 作者信息一起查出来,include 是 Prisma 用来关联查询、连带取出关联表数据的关键字
            author: {
                select:{
                    // id: true,
                    name: true,
                    // email: true
                }
            }
        }
    })

    return NextResponse.json({
        code: 0,
        msg: 'success',
        data: posts
    })
} 
