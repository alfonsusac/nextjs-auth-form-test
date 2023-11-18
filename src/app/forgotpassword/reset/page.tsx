import { forgotPasswordVerification } from "@/api/authentication"
import { InvalidVerificationError } from "@/api/verification"
import { ClientError, redirect } from "@/lib/error"
import { Password, User } from "@/model/user"

export default async function ResetPassword({ searchParams }: any) {
  
  const jwtFromSearchParam = searchParams.k
  if (!jwtFromSearchParam) redirect('/forgotpassword')

  try {

    const { payload, verified } = await forgotPasswordVerification.verify(jwtFromSearchParam)

    if (!verified)
      redirect('/forgotpassword', 'error=Verification failed! Please try again.')

    const user = await User.findEmail(payload.email)

    if (!user) {
      throw new ClientError("User Not Found. Even after verifying their email")
    }

    return (
      <>
        <h2>Reset Password</h2>
        <form>
          
        </form>
      </>
    )


  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error

    if (error instanceof InvalidVerificationError)
      redirect('/verify/fail', 'error=Verification no longer valid. Please try again.')

    console.log(error)
    redirect('/verify/fail', 'error=Unknown server error')
  }


}