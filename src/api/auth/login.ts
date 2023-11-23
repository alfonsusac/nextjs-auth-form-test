import { Cryptography } from "@/lib/crypto"
import { Password } from "@/model/user"
import { UserJWTCookie } from "../authentication"
import { InvalidCredentialClientError } from "@/lib/error"

export namespace Auth {

  export async function login({ username, password }: {
    username: string,
    password: string
  }) {

    // Find stored password in the database based on username
    const storedpassword = await Password.find(username)
    if (!storedpassword) throw new InvalidCredentialClientError("User not found")

    // Verify that the inputted password same as stored password
    if (!await Cryptography.verify(storedpassword.value, password))
      throw new InvalidCredentialClientError("Password does not match")

    // Create JWT and set Cookie of the current session
    const { user } = storedpassword
    await UserJWTCookie.encodeAndSetCookie({
      username: user.username,
      email: user.email,
      verified: user.verification?.verified ?? false,
    })

  }
}