import { Authentication } from "@/api/authentication"
import { sendEmailVerification } from "@/api/verification"
import { Form } from "@/component/form"
import { Navigation } from "@/lib/error"

export default async function Page({ searchParams }: any) {

  const session = await Authentication.getSession()
  if (!session) Navigation.redirectTo('/login')

  return (
    <Form sp={ searchParams }>
      <div data-callout-error>Verification Failed. Please try again</div>
      <div>
        <button type="submit" formAction={
          async () => {
            "use server"
            const session = await Authentication.requireSession()
            await sendEmailVerification(session.username, session.email)
            Navigation.redirectTo('/', 'success=Successful! Your email is verified.')
          }
        }>
          Resend Notification
        </button>
      </div>
    </Form>
  )
}