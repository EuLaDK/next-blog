import assert from "node:assert/strict"
import test from "node:test"

test("refresh token is signed and verified with the refresh secret", async () => {
  process.env.ACCESS_TOKEN_SECRET = "access-secret-for-jwt-test"
  process.env.REFRESH_TOKEN_SECRET = "refresh-secret-for-jwt-test"

  const jwt = await import(`./jwt.ts?case=${Date.now()}`)
  const token = await jwt.signRefreshToken({ userId: "user-1", username: "EuLaDK" })
  const payload = await jwt.verifyRefreshToken(token)

  assert.equal(payload?.userId, "user-1")
  assert.equal(payload?.username, "EuLaDK")
  assert.equal(await jwt.verifyAccreeToken(token), null)
})
