import { EncryptJWT, jwtDecrypt } from "jose"
import { Cryptography } from "./crypto"
import { StringValue } from "@/../ms/dist"
import { Cookie } from "./cookies"

// Date.now()             returns timestamp in milliseconds
// Date.now() / 1000      divides by 1000, returns float
// Date.now() / 1000 | 0  removes decimal points
const thisSecond = () => (Date.now() / 1000) | 0


const encryptionSecretDefault = "EncryptionKey"


/**
 * Encode payload to jwt
 */
export async function create(param: {
  payload?: any
  maxAge?: number // default 30 days 
}) {
  const maxAge = param.maxAge ?? 30 * 24 * 60 * 30 // 30 days
  const encryptionSecret = await Cryptography.getEncryptionKey(encryptionSecretDefault)
  return await new EncryptJWT(param.payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(thisSecond() + maxAge)
    .setJti(crypto.randomUUID())
    .encrypt(encryptionSecret)
}

/**
 * Decode incoming jwt
 */
export async function decode<Payload>(param: {
  jwt: string,
}) {
  if (!param.jwt) return null
  const encryptionSecret = await Cryptography.getEncryptionKey(encryptionSecretDefault)
  const { payload } = await jwtDecrypt<Payload>(param.jwt, encryptionSecret, {
    clockTolerance: 15,
  })
  return payload
}


export class JWTHandler<Payload extends {}> {
  
  constructor(
    readonly durationStringInSeconds: StringValue
  ) { }

  async encode(payload: Payload) {

    console.log("Encoding JWT")

    return await new EncryptJWT(payload)
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setIssuedAt()
      .setExpirationTime(this.durationStringInSeconds ?? "30 d")
      .setJti(crypto.randomUUID())
      .encrypt(
        await Cryptography.getEncryptionKey(encryptionSecretDefault)
      )

  }

  async decode(jwt: string) {

    if (!jwt) return null
    const encryptionSecret = await Cryptography.getEncryptionKey(encryptionSecretDefault)
    const { payload } = await jwtDecrypt<Payload>(jwt, encryptionSecret, { clockTolerance: 15 })
    return payload

  }

}

export class JWTCookieHandler<Payload extends {}>{

  readonly jwt: JWTHandler<Payload>;
  readonly cookie: Cookie;

  constructor(
    cookieName: string,
    durationStringInSeconds: StringValue
  ) { 
    this.jwt = new JWTHandler(durationStringInSeconds)
    this.cookie = Cookie.create(cookieName, {
      secure: true,
      httpOnly: true,
      sameSite: "lax"
    })
  }

  async encodeAndSetCookie(payload: Payload) {

    console.log("Encode payload to JWT and set as cookie")
    const token = await this.jwt.encode(payload)
    this.cookie.set(token)

  }


  async getCookieAndDecode() {

    const rawCookie = this.cookie.readOnly.get()
    if (!rawCookie) {
      console.log("Auth Cookie not Found")
      return null
    }
    try {
      const session = await this.jwt.decode(rawCookie)
      return session
    }
    catch (error) {
      console.log("Error Reading Cookie")
      console.error(error)
      this.cookie.delete()
      return null
    }

  }

  async deleteCookie() {
    this.cookie.delete()
  }

}