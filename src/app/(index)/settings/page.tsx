import { Authentication, getCurrentSession } from "@/api/authentication"
import { AccountManagement } from "@/api/user-management"
import { sendEmailVerification } from "@/api/verification"
import { AuthGuard, IfNotVerified, IfVerified } from "@/component/authentication"
import { Form } from "@/component/form"
import { Navigation } from "@/lib/error"

export default async function Page({ searchParams }: any) {
  
  const session = await Authentication.requireSession()

  async function verifyAction() {
    "use server"
    const session = await Authentication.requireSession()
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
      await AccountManagement.deleteUser(await Authentication.requireVerifiedSession())
      Navigation.redirectTo('/', 'success=Account successfully deleted!')
    } catch (error) {
      Navigation.handleFormError(error)
    }
  }


  return <section className="max-w-screen-sm mx-auto">
    <a href="/">{ '<- Back' }</a>
    <h1>Settings</h1>

    <Form sp={ searchParams } className="
      [&>section]:mb-16
      [&>section>section]:flex
      [&>section>section]:justify-between
      [&>section>section]:items-center
      [&>section>section]:gap-2
      [&>section>h2]:mb-4
    ">
      <section>

        <h2>Account</h2>

        <IfNotVerified>
          <section>
            <p>Your email is not verified. Please verify your email</p>
            <button type="submit" formAction={ verifyAction }>Verify Email</button>
          </section>
        </IfNotVerified>

        <section>
          <p>Delete Account <br /><IfNotVerified><span className="opacity-20">Please verify your email to delete account</span></IfNotVerified></p>
          <IfVerified><button data-destructive formAction={ deleteUserAction }>Delete Account</button></IfVerified>
        </section>

        <section>
          <p>Change Password <br /><IfNotVerified><span className="opacity-20">Please verify your email to change password</span></IfNotVerified></p>
          <IfVerified><a href="/settings/changepassword">Change Password</a></IfVerified>
        </section>

        <section>
          <p>Log out</p>
          <button formAction={ logoutAction }>Log out</button>
        </section>

      </section>

      <section>

        <h2>Profile</h2>

        <section>
          <p>Username <br /><span className="opacity-60 leading-loose">{ session?.username }</span></p>
          <button type="submit">Edit username</button>
        </section>

        <section>
          <p>Email <br /><span className="opacity-60 leading-loose">{ session?.email }</span></p>
          <button type="submit">Edit email</button>
        </section>
      </section>

    </Form >
  </section>
}

