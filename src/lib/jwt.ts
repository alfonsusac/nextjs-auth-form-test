import { EncryptJWT, JWTPayload, jwtDecrypt, errors as joseErrors } from "jose"
import { Cryptography } from "./crypto"
import ms, { StringValue } from "@/../ms/dist"
import { ClientError } from "./error/class"
import { logger } from "./logger"
import { Cookie } from "./cookies"

// Date.now()             returns timestamp in milliseconds
// Date.now() / 1000      divides by 1000, returns float
// Date.now() / 1000 | 0  removes decimal points
const thisSecond = () => (Date.now() / 1000) | 0
const encryptionSecretDefault = "EncryptionKey"
const clockTolerance = 15

const logjwt = logger("JWT ", "grey")
const logjwtcookie = logger("JWTCookie ", "grey")

type PayloadType = { [key: string]: any }

export class JWTHandler<Payload extends PayloadType> {
  constructor(
    readonly durationStringInSeconds: StringValue
  ) { }
  /**
   * Encode payload to jwt
   */
  async encode(payload: Payload) {
    return await new EncryptJWT(payload)
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setIssuedAt()
      .setExpirationTime(this.durationStringInSeconds ?? "30 d")
      .setJti(crypto.randomUUID())
      .encrypt(await Cryptography.getEncryptionKey(encryptionSecretDefault))
  }
  /**
   * Decode incoming jwt
   */
  async decode(jwt: string) {
    return await JWTHandler.decode<Payload>(jwt)
  }
  static async decode<Payload extends PayloadType = JWTPayload>(jwt: string) {
    const encryptionSecret = await Cryptography.getEncryptionKey(encryptionSecretDefault)
    const { payload } = await jwtDecrypt<Payload>(jwt, encryptionSecret, { clockTolerance })
    return payload
  }
}





export class JWTCookieHandler<Payload extends {[key: string]: any}>{
  readonly jwt: JWTHandler<Payload>
  readonly cookie: Cookie
  constructor(
    cookieName: string,
    durationStringInSeconds: StringValue
  ) {
    this.jwt = new JWTHandler(durationStringInSeconds)
    this.cookie = new Cookie(cookieName, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: ms(durationStringInSeconds) / 1000,
    })
  }

  async encodeAndSetCookie(payload: Payload) {
    logjwtcookie("Encode payload to JWT and set as cookie")
    const token = await this.jwt.encode(payload)
    this.cookie.set(token)
  }

  async getCookieAndDecode() {
    logjwtcookie("Get cookie from request and decode cookie")
    const rawCookie = this.cookie.get()
    if (!rawCookie) {
      logjwtcookie("Auth Cookie not Found")
      return null
    }

    try {
      const session = await this.jwt.decode(rawCookie)
      return session
    }
    catch (error) {
      if (error instanceof joseErrors.JWTExpired) {
        logjwtcookie("JWT Expired")
      } else {
        logjwtcookie("Error Reading Cookie")
      }
      console.error(error)
      this.cookie.delete()
      return null
    }
  }
  async updateJWTandSetCookie(
    getNewJWT: (old: (Payload & JWTPayload)) => Payload
  ) {
    logjwtcookie("Update payload to JWT and set as cookie")
    const payload = await this.getCookieAndDecode()
    if (!payload) ClientError.notAuthenticated()
    await this.encodeAndSetCookie(getNewJWT(payload))
  }
  deleteCookie() {
    this.cookie.delete()
  }
}