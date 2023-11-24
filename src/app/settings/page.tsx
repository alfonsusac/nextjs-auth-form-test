import { Authentication, getCurrentSession, getUserAndRedirectToHomeIfNotAuthenticated } from "@/api/authentication"
import { UserManagement } from "@/api/user-management"
import { sendEmailVerification } from "@/api/verification"
import { AuthGuard, IfNotVerified, IfVerified } from "@/component/authentication"
import { Form } from "@/component/form"
import { Navigation } from "@/lib/error"

export default async function Page({ searchParams }: any) {
  const session = await getCurrentSession()

  async function verifyAction() {
    "use server"
    const session = await getUserAndRedirectToHomeIfNotAuthenticated()
    await sendEmailVerification(session.username, session.email)
    Navigation.success('Email sent! Check your email to verify')
  }

  async function logoutAction() {
    "use server"
    try {
      await Authentication.logout()
      Navigation.redirectTo('/', `success=Successfully logged out`)
    } catch (error) {
      Navigation.handleFormError(error)
    }
  }

  async function deleteUserAction() {
    "use server"
    try {
      await UserManagement.deleteUser(await Authentication.requireSession())
      Navigation.redirectTo('/', 'success=Account successfully deleted!')
    } catch (error) {
      Navigation.handleFormError(error)
    }
  }


  return <>
    <AuthGuard />
    <a href="/">{ '<- Back' }</a>

    <h2>Settings</h2>

    <Form sp={ searchParams }>
      <section>

        <h3>Account</h3>

        <IfNotVerified>
          <section data-inline-between>
            <p>Your email is not verified. Please verify your email</p>
            <button type="submit" formAction={ verifyAction }>Verify Email</button>
          </section>
        </IfNotVerified>

        <section data-inline-between>
          <p>Delete Account <br /><IfNotVerified><span className="opacity-20">Please verify your email to delete account</span></IfNotVerified></p>
          <IfVerified><button data-destructive formAction={ deleteUserAction }>Delete Account</button></IfVerified>
        </section>

        <section data-inline-between>
          <p>Change Password <br /><IfNotVerified><span className="opacity-20">Please verify your email to change password</span></IfNotVerified></p>
          <IfVerified><a href="/changepassword">Change Password</a></IfVerified>
        </section>

        <section data-inline-between>
          <p>Log out</p>
          <button formAction={ logoutAction }>Log out</button>
        </section>

      </section>
      <section className="mt-8">

        <h3>Profile</h3>

        <section data-inline-between>
          <p>Username <br /><span className="opacity-60 leading-loose">{ session?.username }</span></p>
          <button type="submit">Edit username</button>
        </section>

        <section data-inline-between>
          <p>Email <br /><span className="opacity-60 leading-loose">{ session?.email }</span></p>
          <button type="submit">Edit email</button>
        </section>
      </section>

    </Form >
  </>
}

