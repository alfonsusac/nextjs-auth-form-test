import { authCookie, jwtsecret } from "./actions"
import * as jose from "jose"

type Session = {
  
}

type AuthFunction = {
  user: Session,

}

export async function auth() {
  const auth = authCookie.readOnly.get()
  let data
  let errorMsg
  if (auth) {
    try {
      data = await jose.jwtVerify(auth, jwtsecret, {
        issuer: "alfon-auth",
      })
    } catch (error) {
      errorMsg = JSON.stringify(error, null, 1)
    }
  }
}