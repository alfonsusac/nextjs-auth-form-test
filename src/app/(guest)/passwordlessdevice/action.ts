"use server"

import { LoginWith2FASession, LoginWithDeviceWebAuthnSession, Session } from "@/api/session"
import { Navigation } from "@/lib/error"
import { ClientError } from "@/lib/error/class"
import { Request } from "@/lib/request"
import prisma from "@/lib/singleton"
import { User } from "@/model/user"
import { server } from "@passwordless-id/webauthn"
import { AuthenticationEncoded, RegistrationEncoded } from "@passwordless-id/webauthn/dist/esm/types"

export async function getUserDeviceAuthIDAction(username: string) {
  try {
    const userdevices = await prisma.userDeviceAuth.findMany({
      where: { username }
    })
    return { ids: userdevices.map(u => u.id) } as const
  } catch (error: any) {
    console.error(error)
    return { error: error.message ?? JSON.stringify(error) } as const
  }
}

export async function checkUsernameForDeviceAuthAction(username: string) {
  try {
    const user = await User.findUsername(username)
    if (!user) return { nouser: true }
    if (user.provider === 'magiclink')
      ClientError.invalidInput('This user is using magic link. Please login via Magic Link instead!')
    if (user.provider === 'password')
      ClientError.invalidInput('This user is using password. Please login using Password instead!')
    else
      ClientError.invalidInput('This user is not using webauthn. Please provide what to do on other provider: ' + user.provider)
  } catch (error: any) {
    console.error(error)
    return { error: error.message ?? JSON.stringify(error) } as const
  }
}

export async function verifyRegistrationAction(
  registration: RegistrationEncoded,
  challenge: string
) {
  try {
    // console.log("Verifying Registration at the Server")

    const registrationParsed = await server.verifyRegistration(registration, {
      challenge,
      origin: Request.getServerBaseURL()
    })
    // console.log(" START --- Registration Parsed")
    // console.log(registrationParsed)
    // console.log(" END --- Registration Parsed")

    LoginWithDeviceWebAuthnSession.create({
      username: registrationParsed.username,
      algorithm: registrationParsed.credential.algorithm,
      publicKey: registrationParsed.credential.publicKey,
      id: registrationParsed.credential.id
    })

  } catch (error: any) {
    console.error(error)
    return { error: error.message ?? JSON.stringify(error) } as const
  }
  Navigation.redirectTo('/passwordlessdevice/register', 'success=Successfully registered in with device. Please enter your email.')
}

export async function verifyAuthenticationAction(
  authentication: AuthenticationEncoded,
  challenge: string
) {
  try {
    const credentialKeyResult = await prisma.userDeviceAuth.findUnique({
      where: { id: authentication.credentialId }
    })
    if(!credentialKeyResult) ClientError.invalidInput("Credential Key Not Found")
    const { username, ...credentialKey } = credentialKeyResult

    server.verifyAuthentication(authentication, {
      id: credentialKey.id,
      algorithm: credentialKey.algorithm as any,
      publicKey: credentialKey.publicKey
    }, {
      challenge,
      origin: Request.getServerBaseURL(),
      userVerified: true
    })

    Navigation.redirectTo('/', 'success=Successfully logged in via device!')
  } catch (error: any) {
    console.error(error)
    return { error: error.message ?? JSON.stringify(error) } as const
  }
}