import hkdf from "@panva/hkdf"
import { EncryptJWT, JWTPayload, jwtDecrypt } from "jose"
import { Cryptography } from "./crypto"

// Date.now()             returns timestamp in milliseconds
// Date.now() / 1000      divides by 1000, returns float
// Date.now() / 1000 | 0  removes decimal points
const thisSecond = () => (Date.now() / 1000) | 0


const encryptionSecretDefault = "EncryptionKey"

export namespace JWT {

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
}

export function newJWT<Payload>(maxAge: number = Infinity) {
  return {
    encode: async (payload: Payload): Promise<string> => {
      return await JWT.create({ payload, maxAge })
    },

    decode: async (jwt: string): Promise<Payload | null> => {
      return await JWT.decode({ jwt })
    }
  }
} 