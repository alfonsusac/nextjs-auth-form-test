import { ClientError } from '@/lib/error/class'
import prisma from '@/lib/singleton'
import { User } from '@/model/user'
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'
import { server } from '@passwordless-id/webauthn'

// Human-readable title for your website
const rpName = 'Alfon Auth Learning Project'
// A unique identifier for your website
const rpID = 'localhost'
// The URL at which registrations and authentications should occur
const origin = `https://${rpID}`



export namespace WebAuhtnStrategy {

  

  // export async function generateOptions({ username, email }: {
  //   username: string,
  //   email: string
  // }) {
  //   const user = await User.create({ username, email, provider: "webauthn", hashedPassword: undefined })

  //   const options = await generateRegistrationOptions({
  //     rpName,
  //     rpID,
  //     userID: username,
  //     userName: username,

  //     // Don't prompt users for additional information about the authenticator
  //     // (Recommended for smoother UX)
  //     attestationType: 'none',

  //     // See "Guiding use of authenticators via authenticatorSelection" below
  //     authenticatorSelection: {
  //       // Defaults
  //       residentKey: 'preferred',
  //       userVerification: 'preferred',
  //       // Optional
  //       authenticatorAttachment: 'platform',
  //     },
  //   })

  //   await prisma.userDeviceAuth.create({
  //     data: {
  //       username,
  //       challenge: options.challenge
  //     }
  //   })

  //   return options
  // }
  // export async function verifyRegistration({ username, responseBody }: {
  //   username: string,
  //   responseBody: any
  // }) {
  //   const user = await User.findUsername(username)
  //   const deviceAuth = await prisma.userDeviceAuth.findUniqueOrThrow({ where: { username } })
  //   const expectedChallenge = deviceAuth.challenge

  //   let verification
  //   try {
  //     verification = await verifyRegistrationResponse({
  //       response: responseBody,
  //       expectedChallenge,
  //       expectedOrigin: origin,
  //       expectedRPID: rpID,
  //     })
  //   } catch (error: any) {
  //     console.error(error)
  //     ClientError.invalidInput(error.message)
  //   }

  //   const { verified } = verification;

  //   const { registrationInfo } = verification
  //   if(!registrationInfo) throw new Error('Not Verified?')
    
  //   await prisma.authenticator.create({
  //     data: {
  //       credentialID: Buffer.from(registrationInfo.credentialID).toString('base64'),
  //       credentialPublicKey: Buffer.from(registrationInfo.credentialPublicKey),
  //       credentialDeviceType: registrationInfo.credentialDeviceType,
  //       credentialBackedUp: registrationInfo.credentialBackedUp,
  //       counter: registrationInfo.counter,
  //     }
  //   })

  //   return { verified }
  // }

}