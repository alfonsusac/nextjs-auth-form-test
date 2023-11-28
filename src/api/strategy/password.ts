import { Cryptography } from "@/lib/crypto"
import { ClientError } from "@/lib/error/class"
import { UserPassword } from "@/model/userpassword"
import { User } from "@/model/user"
import { User2FA } from "@/model/user2fa"
import { LoginSession, Session } from "../session"
import { Navigation } from "@/lib/error"
import { AuthenticatorMFA } from "@/lib/2fa"
import { development } from "@/lib/env"
import { authenticator } from "otplib"
import { Verifications } from "../globals"

export namespace PasswordStrategy {
  export async function register({ username, email, password }: {
    username: string,
    email: string,
    password: string
  }) {
    const hashedPassword = await Cryptography.hash(password)
    await User.create({ username, email, provider: "password", hashedPassword })
  }
  
  
  export async function login({ username, password }: {
    username: string,
    password: string
  }) {
    const storedpassword = await UserPassword.find(username)
    if (!storedpassword) ClientError.invalidCredential("User not found")
  
    if (!await Cryptography.verify(storedpassword.value, password))
      ClientError.invalidCredential("Password does not match")
  
    const { user } = storedpassword
  
    const using2fa = await User2FA.find({ username })
    if (using2fa) {
      await LoginSession.create({
        username: user.username
      })
      if (development) {
        console.log(authenticator.generate(using2fa))
      }
      Navigation.redirectTo('/login/app')
    }
  
    await Session.create({
      username: user.username,
      email: user.email,
      verified: user.verification?.verified ?? false,
    })
  }
  export async function loginWith2FA(input: {
    username: string,
    otptoken: string
  }) {
    const userMFAkey = await User2FA.find(input)
    if (!userMFAkey) ClientError.invalidCredential('This user does not use 2FA')
  
    if (!AuthenticatorMFA.check(input.otptoken, userMFAkey))
      ClientError.invalidInput('Invalid Token. Please try again.')
  
    const user = await User.findUsername(input.username)
    if (!user) ClientError.invalidCredential('Username not found!')
  
    LoginSession.destroy()
  
    await Session.create({
      username: user.username,
      email: user.email,
      verified: true
    })
  }
  export async function requestForgotPassword(input: {
    email: string,
  }) {
    const user = await User.findEmail(input.email)
    if (!user)
      ClientError.invalidInput("Email not found!")
    if (user.provider === "magiclink")
      ClientError.invalidInput("This user is using passwordless. Login with passwordless instead!")
  
    await Verifications.forgotPasswordVerification.send(input.email, {
      username: user.username,
    })
  }
  export async function resetPassword({ username, newPassword }: {
    username: string,
    newPassword: string,
  }) {
    // Hash the inputted password
    const newHashedPassword = await Cryptography.hash(newPassword)
    // Store the new user detail to the database
    return await UserPassword.forceUpdate({
      username,
      newHashedPassword
    })
  }

}