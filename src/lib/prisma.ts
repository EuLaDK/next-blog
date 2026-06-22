// 创建唯一的prisma实例，避免每次热更新再次创建prisma实例

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma'

/**
 * 创建带 PostgreSQL driver adapter 的 Prisma Client。
 * @returns Prisma Client 单例实例
 */
const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
        throw new Error('Missing DATABASE_URL')
    }

    const adapter = new PrismaPg({ connectionString })

    return new PrismaClient({ adapter })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
