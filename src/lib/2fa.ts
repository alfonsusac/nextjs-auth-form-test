import { authenticator } from "otplib"
import { Cryptography } from "./crypto"

const secretServerKey = "asd"

export namespace AuthenticatorMFA {
  export async function generate() {
    return authenticator.generateSecret()
  }
  export function check(totpcode: string, secretKey: string) {
    return authenticator.check(totpcode, secretKey)
  }
} 