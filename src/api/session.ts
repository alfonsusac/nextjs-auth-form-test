import { ClientError } from "@/lib/error/class"
import { JWTCookieType } from "@/lib/jwt"
import { logger } from "@/lib/logger"

const log = logger("Session ", "yellow")

type SessionPayload = {
  username: string
  email: string
  verified: boolean
}

export namespace Session {
  
  const UserJWTCookie = new JWTCookieType<SessionPayload>("alfon-auth", "24 h")
  
  export async function create(payload: SessionPayload) {
    log("Creating session")
    await UserJWTCookie.encodeAndSetCookie(payload)
  }
  
  export async function getCurrent() {
    log("Getting current session")
    return await UserJWTCookie.getCookieAndDecode()
  }
  
  export async function update(
    getNewJWT: (prev: SessionPayload) => SessionPayload
  ) {
    log("Updating session")
    const payload = await Session.getCurrent()
    if (!payload) ClientError.notAuthenticated()
    await UserJWTCookie.encodeAndSetCookie(getNewJWT(payload))
  }

  export function destroy() {
    log("Destroying session")
    UserJWTCookie.deleteCookie()
  }

}
