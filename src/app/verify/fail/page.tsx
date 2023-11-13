import { auth, sendEmailVerification } from "@/api/authentication"
import { redirect } from "@/lib/error"

export default async function Page() {
  const { session } = await auth()
  if(!session) redirect('/login')

  return (
    <>
      <div data-callout-error>Verification Failed. Please try again</div>
      <div>
        <button type="submit" formAction={
          async () => {
            "use server"
            const { session } = await auth()
            if (!session)
              redirect('/', 'error=Not Authenticated. Please log in again.')
            
            const data = await sendEmailVerification(session.username, session.email)
            redirect('/', 'success=Successful! Your email is verified.')
          }
        }>
          Resend Notification
        </button>
      </div>
    </>
  )
}