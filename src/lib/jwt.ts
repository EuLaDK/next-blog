import * as jose from 'jose'

const ASSESS_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)
const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET)

export interface UserPayload {
    userId: string;
    username: string;
}

// 生成access token
export async function signAccessToken(payload: UserPayload): Promise<string> {
    return await new jose.SignJWT({...payload})
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('15m') // 15分钟过期
    .sign(ASSESS_SECRET);
}

// 生成refresh token
export async function signRefreshToken(payload: UserPayload): Promise<string> {
    return await new jose.SignJWT({...payload})
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('7d') // 一周过期
    .sign(REFRESH_SECRET);
}

// 验证 Access Token
export async function verifyAccreeToken(token: string): Promise<UserPayload | null> {
    try {
        const { payload } = await jose.jwtVerify(token, ASSESS_SECRET);
        return payload as unknown as UserPayload;
    } catch {
        return null;
    }
}

// 验证 Refresh Token
export async function verifyRefreshToken(token: string): Promise<UserPayload | null>{
    try {
        const { payload } = await jose.jwtVerify(token, REFRESH_SECRET);
        return payload as unknown as UserPayload;
    } catch {
        return null
    }
}

// 刷新 accessToken
export async function refreshAccessToken(refreshToken: string) {
    const payload = await verifyRefreshToken(refreshToken)
    if (!payload) return null

    const { userId, username } = payload
    const newAccessToken = await signAccessToken({ userId, username })
    return newAccessToken
}
