import { ClientError, ClientErrorBaseClass } from "@/lib/error/class"
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

  const userSession = new JWTCookieHandler<SessionPayload>("alfon-auth", "24 h")

  export async function create(payload: SessionPayload) {
    log("Creating session")
    await userSession.encodeAndSetCookie(payload)
  }
  export const get = cache(
    async function () {
      return await userSession.getCookieAndDecode()
    }
  )
  export async function update(
    getNewJWT: (prev: SessionPayload) => SessionPayload
  ) {
    log("Updating session")
    const payload = await Session.get()
    if (!payload) ClientError.notAuthenticated()
    await userSession.encodeAndSetCookie(getNewJWT(payload))
  }
  export function destroy() {
    log("Destroying session")
    userSession.deleteCookie()
  }
}

type TemporarySessionPayload = {
  username: string,
}
export namespace LoginWith2FASession {
  const tempUserSession = new JWTCookieHandler<TemporarySessionPayload>("alfon-auth-temp-login", "1 h")

  export async function create(payload: TemporarySessionPayload) {
    log("Creating session")
    await tempUserSession.encodeAndSetCookie(payload)
  }
  export const get = cache(
    async function () {
      return await tempUserSession.getCookieAndDecode()
    }
  )
  export async function update(
    getNewJWT: (prev: TemporarySessionPayload) => TemporarySessionPayload
  ) {
    const payload = await LoginWith2FASession.get()
    if (!payload) throw new ClientErrorBaseClass('Session not found!')
    await tempUserSession.encodeAndSetCookie(getNewJWT(payload))
  }

  export function destroy() {
    tempUserSession.deleteCookie()
  }
}


type LoginWithDeviceWebAuthnSessionPayload = {
  publicKey: string,
  algorithm: string,
  username: string,
  id: string,
}
export namespace LoginWithDeviceWebAuthnSession {
  const tempUserSession = new JWTCookieHandler<LoginWithDeviceWebAuthnSessionPayload>("alfon-auth-temp-login-webauthn", "1 h")

  export async function create(payload: LoginWithDeviceWebAuthnSessionPayload) {
    log("Creating session")
    await tempUserSession.encodeAndSetCookie(payload)
  }
  export const get = cache(
    async function () {
      return await tempUserSession.getCookieAndDecode()
    }
  )
  export async function update(
    getNewJWT: (prev: LoginWithDeviceWebAuthnSessionPayload) => LoginWithDeviceWebAuthnSessionPayload
  ) {
    const payload = await LoginWithDeviceWebAuthnSession.get()
    if (!payload) throw new ClientErrorBaseClass('Session not found!')
    await tempUserSession.encodeAndSetCookie(getNewJWT(payload))
  }

  export function destroy() {
    tempUserSession.deleteCookie()
  }
}