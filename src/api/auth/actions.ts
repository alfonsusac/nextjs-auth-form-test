import { emailAutofill, loginForm, registerForm, usernameAutofill } from "@/app/forms"
import { User } from "@/model/user"
import { Error } from "@/lib/action"
import { Cryptography } from "@/lib/crypto"
import { redirect } from "next/navigation"
import { Cookie } from "@/lib/cookies"
import * as jose from 'jose'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import crypto, { verify } from "node:crypto"

const privateKey = "Insert Cryptographically Strong Key Here (Secret Key/Private Key)"
export const jwtsecret = new TextEncoder().encode(
  'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
)

export const authCookie = Cookie.create('alfon-auth', {
  secure: true,
  httpOnly: true,
  sameSite: "strict"

})

// Logs in user
export async function login(formData: FormData) {
  "use server"

  // Validation
  const data = loginForm.validate(formData)
  if (!data.ok) Error.setSearchParam({ error: "Invalid input" })
  const { usr, pwd } = data

  try {
    const user = await User.find(usr)

    if (!user)
      Error.setSearchParam({ error: "User not found!" })

    if (!await Cryptography.verify(user.password, pwd))
      Error.setSearchParam({ error: "Wrong Password!" })

    // successfull authentication


    
    const jwt = await new jose.SignJWT()
      .setProtectedHeader({ alg: "HS256", typ: "jwt", })
      .setSubject(usr)
      .setIssuedAt()
      .setIssuer('alfon-auth')
      .setExpirationTime('2h')
      .sign(jwtsecret)
    
    
    
    // const hmac = crypto.createHmac("sha256", privateKey)
    // const signedJwt = hmac.update(jwt).digest('base64')
    // authCookie.set(signedJwt)

    authCookie.set(jwt)
    redirect('/')

  } catch (error) {
    Error.handleActionError(error)
    Error.setSearchParam({ error: "Unknown Server Error" })
  }
}

// Register user
export async function register(formData: FormData) {
  "use server"

  const data = registerForm.validate(formData)
  if (!data.ok) Error.setSearchParam({ error: "Invalid input" })
  const { eml, usr, pwd } = data

  try {
    const hashedPwd = await Cryptography.hash(pwd)
    await User.create(usr, eml, hashedPwd)
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        if (Error.includes(error.meta, "email")) {
          Error.setSearchParam({error:"Email is already taken!"})
        }
        if (Error.includes(error.meta, "username")) {
          Error.setSearchParam({error:"Username is already taken!"})
        }
      }
    }
    Error.setSearchParam({ error: "Unknown Server Error" })
  }
  redirect("/")

}


export async function auth() {
  
}