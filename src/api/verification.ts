import { JWTHandler } from "@/lib/jwt"
import { UserVerification } from "@/model/user"
import { Request } from "@/lib/request"
import { Email } from "@/lib/email"
import { ClientError, redirect } from "@/lib/error"
import ms, { StringValue } from "@/lib/ms"
import { DB } from "@/model/verification"
import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server"

/** ========================================================================================
*
*  ⭐ [Public Object] ⭐
*
* ========================================================================================
*/

/** 
 *  Verification JWT Object
 */
export const verificationJWT = new JWTHandler<{ verification: string }>("24 h")
export const passwordlessVerificationJWT = new JWTHandler<{ verification: string, email: string }>("24 h")

/** ========================================================================================
*
*  🔨 [Public Functions] 🔨
*
* ========================================================================================
*/

/** 
 *  Sends Email Verifiation
 *   
 */
export async function sendEmailVerification(username: string, email: string) {

  // Store the verification id in the database
  const { id } = await UserVerification.setKey(username)

  // Sign the verification ID via JWT (so that it can't be tampered)
  const signedVerification = await verificationJWT.encode({ verification: id })

  // Send verification Email.
  await Email.verifyViaEmail({
    recipient: email,
    subject: 'Welcome! Please verify your Email',
    text: `Hi ${username}\nThis is for Alfon's Personal Learning Journey of Authentication. Verification Link: ${Request.getServerBaseURL()}/verify/?k=${signedVerification}`,
  })

}
/**
 *  Verify Email Verification
 * 
 */
export async function verifyEmailVerification(jwt: string) {

  // Reveive the jwt from the search params
  const payload = await verificationJWT.decode(jwt)
  if (!payload) throw new DecodingError("The JWT Payload is Null")

  // Validate the jwt by checking if it has required property
  const key = payload?.verification
  if (!key) throw new DecodingError("The key inside jwt payload is undefined")

  // Verify with the database by trying to delete them
  return UserVerification.verifyKey(key)

}

/** ========================================================================================
*
*  🚧 [Error Class] 🚧
*
* ========================================================================================
*/

export class DecodingError extends ClientError {
  constructor(servermsg: string) {
    super("Invalid Verification Token", servermsg)
  }
}

export class InvalidSearchParam extends ClientError {
  constructor(msg: string) {
    super(msg)
    console.log("Invalid Search Params: " + msg)
  }
}
export class VerificationError extends ClientError { }

/** ========================================================================================
*
*  🚧 [Class] 🚧
*
* ========================================================================================
*/

const log = logger("Email Verification ",)

type VerificationJWTPayload<Data> = DefaultVerificationJWTPayload & {
  data?: Data
}
type DefaultVerificationJWTPayload = {
  verification: string,
  purpose: string,
  data: { [key: string]: string } | undefined
}

export class EmailVerification<
  Data extends { [key: string]: string } | undefined = undefined,
  Context extends { [key: string]: string } | undefined = undefined,
> {

  private readonly verificationJWT
    = new JWTHandler<
      VerificationJWTPayload<Data>
    >(this.duration)

  constructor(
    readonly purpose: string,
    private readonly duration: StringValue,
    private readonly emailSubject: string,

    private readonly text:
      (url: string, context?: Context) => string,

    readonly redirectURL: string,
  ) { }

  /**
   *  Sends Email Verifiation
   *   
   */
  async send(
    email: string,
    data: Data,
    emailContext?: Context,
  ) {

    log("Sending Email Verification")
    const token = await DB.VerificationToken.create({
      purpose: this.purpose,
      expiryDurationMilisecond: ms(this.duration)
    })

    log("Token Stored")
    const signedToken = await this.verificationJWT.encode(
      {
        verification: token.id,
        purpose: this.purpose,
        data,
      }
    )
    log("Token Encoded")

    const verificationUrl = new URL(Request.getServerBaseURL() + this.redirectURL)
    verificationUrl.searchParams.set('purpose', this.purpose)
    verificationUrl.searchParams.set('key', signedToken)

    const res = await Email.verifyViaEmail({
      recipient: email,
      subject: this.emailSubject,
      text: this.text(verificationUrl.toString(), emailContext),
    })
    console.log(res)
    log("Token Sent")
  }

  async verify(purpose: string, key: string) {

    if (!purpose) throw new InvalidSearchParam("Purpose not provided")
    if (!key) throw new InvalidSearchParam("Key not provided")

    const payload = await JWTHandler.decode<VerificationJWTPayload<Data>>(key)

    const payloadKey = payload.verification

    await DB.VerificationToken.verify({ id: payloadKey })

    return payload.data as Data
  }
}
