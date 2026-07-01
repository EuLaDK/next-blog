import { NextResponse, type NextRequest } from "next/server"

import { signAccessToken, verifyAccreeToken, verifyRefreshToken } from "@/lib/jwt"

const ACCESS_TOKEN_COOKIE = "accessToken"
const REFRESH_TOKEN_COOKIE = "refreshToken"

/**
 * 创建未登录时的跳转地址，并记录原本想访问的路径。
 * @param request 当前进入 proxy 的请求对象
 */
function createLoginRedirectUrl(request: NextRequest): URL {
  const loginUrl = new URL("/", request.url)
  loginUrl.searchParams.set("login", "1")
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`)

  return loginUrl
}

/**
 * 删除失效的登录 Cookie，避免用户反复携带坏 token。
 * @param response 即将返回给浏览器的响应对象
 */
function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete(ACCESS_TOKEN_COOKIE)
  response.cookies.delete(REFRESH_TOKEN_COOKIE)
}

/**
 * 在受保护页面前校验双 token，必要时刷新 accessToken。
 * @param request 当前请求对象
 */
export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value

  if (accessToken) {
    const accessPayload = await verifyAccreeToken(accessToken)

    if (accessPayload) {
      return NextResponse.next()
    }
  }

  if (refreshToken) {
    const refreshPayload = await verifyRefreshToken(refreshToken)

    if (refreshPayload) {
      const nextResponse = NextResponse.next()
      const nextAccessToken = await signAccessToken({
        userId: refreshPayload.userId,
        username: refreshPayload.username,
      })

      nextResponse.cookies.set(ACCESS_TOKEN_COOKIE, nextAccessToken, {
        httpOnly: true,
        maxAge: 60 * 15,
        path: "/",
        sameSite: "lax",
      })

      return nextResponse
    }
  }

  const redirectResponse = NextResponse.redirect(createLoginRedirectUrl(request))
  clearAuthCookies(redirectResponse)

  return redirectResponse
}

export const config = {
  matcher: ["/user/:path*"],
}
