import { EmailVerification } from "./verification"

export namespace Verifications {
  export const passwordlessVerification = new EmailVerification<{
    email: string
  }>(
    "passwordless",
    "1d",
    "Magic one-time use link authentication",
    (url) => `Hi! One time login link: ${url}`,
    "/passwordless/verify",
  )
  export const forgotPassword = new EmailVerification<{
    username: string
  }>("forgotpassword", "1d",
    "One-time link to reset password",
    (url) => `Reset your password here: ${url}`,
    "/forgotpassword/reset",
  )
  export const changeEmail = new EmailVerification<{
    username: string,
    email: string
  }>("changeEmail", "1d",
    "One-time link to change email",
    (url) => `Click here to change your email: ${url}`,
    "/settings/changeemail/ "

  )
}