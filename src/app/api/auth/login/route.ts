import { NextResponse } from 'next/server'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'
import { addUser } from '@/lib/login'
import { isMainlandChinaPhoneNumber } from '@/components/login/phone-validation'


export async function POST(request: Request) {
    try {
        // 拿到用户输入的手机号先查登录
        const { phone } = await request.json()

        if (!isMainlandChinaPhoneNumber(phone)) {
            return NextResponse.json({ message: '手机号格式不正确' }, { status: 400 })
        }

        const res =await addUser({phone})
        // 拿到用户的信息设置token
        const accessToken = await signAccessToken({ userId: res.id, username: res.name || '游客' })
        const refreshToken = await signRefreshToken({ userId: res.id, username: res.name || '游客' })
        // 设置cookie
        const response = NextResponse.json({ message: '登录成功' }, { status: 200 })
        response.cookies.set('accessToken', accessToken, { httpOnly: true, maxAge: 60 * 15, path: '/', sameSite: 'lax' })
        response.cookies.set('refreshToken', refreshToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' })

        return response
    } catch {
        return NextResponse.json({ message: '登录失败' }, { status: 500 })
    }
}
