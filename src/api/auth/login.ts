import { Cryptography } from "@/lib/crypto"
import { Password } from "@/model/user"
import { userJWT } from "../authentication"

export namespace Auth {
  
  export async function login(username: string, password: string) {

    const storedpassword = await Password.find(username)
    if (!storedpassword) return "User not found"

    if (!await Cryptography.verify(storedpassword.value, password))
      return "Wrong password"

    const jwt = await userJWT.encode({
      username: storedpassword.user.username,
      email: storedpassword.user.email,
      verified: storedpassword.user.verification?.verified ?? false,
    })

    return { jwt }

  }
}