import { getCurrentSession } from "@/api/authentication"
import { LoggedInUser } from "@/api/user-management"
import { sendEmailVerification } from "@/api/verification"
import { Form } from "@/component/form"
import { redirect } from "@/lib/error"

export default async function Page({ searchParams }: any) {
  const session = await getCurrentSession()
  if (!session) redirect('/login')

  return (
    <Form searchParams={ searchParams }>
      <div data-callout-error>Verification Failed. Please try again</div>
      <div>
        <button type="submit" formAction={
          async () => {
            "use server"
            const session = await LoggedInUser.getSession()
            await sendEmailVerification(session.username, session.email)
            redirect('/', 'success=Successful! Your email is verified.')
          }
        }>
          Resend Notification
        </button>
      </div>
    </Form>
  )
}