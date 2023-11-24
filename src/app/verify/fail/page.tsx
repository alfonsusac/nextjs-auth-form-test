import { Authentication, getCurrentSession } from "@/api/authentication"
import { LoggedInUser } from "@/api/user-management"
import { sendEmailVerification } from "@/api/verification"
import { Form } from "@/component/form"
import { redirectTo } from "@/lib/error"

export default async function Page({ searchParams }: any) {
  const session = await getCurrentSession()
  if (!session) redirectTo('/login')

  return (
    <Form sp={ searchParams }>
      <div data-callout-error>Verification Failed. Please try again</div>
      <div>
        <button type="submit" formAction={
          async () => {
            "use server"
            const session = await Authentication.requireSession()
            await sendEmailVerification(session.username, session.email)
            redirectTo('/', 'success=Successful! Your email is verified.')
          }
        }>
          Resend Notification
        </button>
      </div>
    </Form>
  )
}