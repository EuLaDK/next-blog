// "use server";
// 因为客户端组件有用到这个，所以必须要加use server不然会报错
import prisma from "./prisma"


export const addUser = async ({phone}:{phone: string}) => {
    // 先查询这个手机号有没有被注册
    const account = await prisma.authAccount.findUnique({
        where: {
            provider_providerAccountId: {
                provider: "phone",
                providerAccountId: phone
            }
        },
        include: {
            user: true
        },
    })
    if (account) {
        return account.user
    }
    // 如果这个手机号没被注册就创建一个新的
    const user = await prisma.user.create({
        data: {
            name: phone,
            accounts: {
                create: {
                    provider: 'phone',
                    providerAccountId: phone
                }
            }
        }
    })
    // 这里后面会处理一个状态码的问题，根据这个状态码来判断要返回的消息
    return user
}