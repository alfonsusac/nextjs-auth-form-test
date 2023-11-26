import { ClientError } from "@/lib/error/class"
import { JWTCookieHandler } from "@/lib/jwt"
import { cache } from "react"
import { logger } from "@/lib/logger"

const log = logger("Session ", "yellow")

type SessionPayload = {
  username: string
  email: string
  verified: boolean
}

export namespace Session {
  
  const UserJWTCookie = new JWTCookieHandler<SessionPayload>("alfon-auth", "24 h")
  
  export async function create(payload: SessionPayload) {
    log("Creating session")
    await UserJWTCookie.encodeAndSetCookie(payload)
  }

  export const get = cache(
    async function () {
      return await UserJWTCookie.getCookieAndDecode()
    }
  )

  
  export async function update(
    getNewJWT: (prev: SessionPayload) => SessionPayload
  ) {
    log("Updating session")
    const payload = await Session.get()
    if (!payload) ClientError.notAuthenticated()
    await UserJWTCookie.encodeAndSetCookie(getNewJWT(payload))
  }

  export function destroy() {
    log("Destroying session")
    UserJWTCookie.deleteCookie()
  }

}
