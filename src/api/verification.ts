import { JWTHandler } from "@/lib/jwt"
import { UserVerification } from "@/model/user"
import { Request } from "@/lib/request"
import { Email } from "@/lib/email"
import { ClientError } from "@/lib/error"
import { VerificationToken } from "@/model/verification"
import ms, { StringValue } from "@/lib/ms"

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
  if (!payload) throw new InvalidVerificationError("The JWT Payload is Null")

  // Validate the jwt by checking if it has required property
  const key = payload?.verification
  if (!key) throw new InvalidVerificationError("The key inside jwt payload is undefined")

  // Verify with the database by trying to delete them
  return UserVerification.verifyKey(key)

}

/** ========================================================================================
*
*  🚧 [Error Class] 🚧
*
* ========================================================================================
*/

export class InvalidVerificationError extends ClientError {

  constructor(servermsg: string) {
    super("Invalid Verification Token", servermsg)
    Object.setPrototypeOf(this, InvalidVerificationError.prototype)
  }
}

/** ========================================================================================
*
*  🚧 [Class] 🚧
*
* ========================================================================================
*/

export class EmailVerification<Context extends { [key: string]: string } | undefined> {
  constructor(
    private readonly purpose: string,
    private readonly duration: StringValue,
    private readonly emailSubject: string,
    private readonly text: (host: string, token: string, context?: Context) => string
  ) {

  }

  async send(email: string): Promise<void>
  async send(email: string, context?: Context) {
    console.log("Sending Email Verification")

    const token = await VerificationToken.create({
      purpose: this.purpose,
      expiryDurationMilisecond: ms(this.duration)
    })

    const signedToken = await passwordlessVerificationJWT.encode({ verification: token.id, email })

    const res = await Email.verifyViaEmail({
      recipient: email,
      subject: this.emailSubject,
      text: this.text(Request.getServerBaseURL(), signedToken, context),
    })
    console.log(res)

  }

  async verify(jwt: string) {
    console.log("Verifying JWT")
    
    const payload = await passwordlessVerificationJWT.decode(jwt)
    if (!payload) throw new InvalidVerificationError("The JWT Payload is Null")
    
    console.log("Payload Decoded")
    
    const key = payload?.verification
    if (!key) throw new InvalidVerificationError("The key inside jwt payload is undefined")
    
    try {
      await VerificationToken.verify({ id: key })
      console.log("Verification key Verified")
      return { payload, verified: true }
    } catch (error) {
      console.log("Verification key Faield to be Verified")
      return { payload, verified: false }
    }


  }
}