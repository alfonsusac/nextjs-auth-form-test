import { Authentication, getCurrentSession } from "@/api/authentication"
import { AccountManagement } from "@/api/user-management"
import { sendEmailVerification } from "@/api/verification"
import { AuthGuard, IfNotVerified, IfVerified } from "@/component/authentication"
import { Form } from "@/component/form"
import { Navigation } from "@/lib/error"
import { ClientError } from "@/lib/error/class"

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

  async function changeUsernameAction(formData: FormData) {
    "use server"
    try {
      const username = formData.get('username') as string
      if (!username) ClientError.invalidInput('Username is required')
      const session = await Authentication.requireSession()
      if (username === session.username) return
      await AccountManagement.changeUsername({ email: session.email, newUsername: username })
      Navigation.success("Username successfully changed")
    } catch (error) {
      Navigation.handleFormError(error)
    }
  }

  async function changeEmailAction(formData: FormData) {
    "use server"
    try {
      const email = formData.get('email') as string
      if (!email) ClientError.invalidInput('Email is required')
      const session = await Authentication.requireSession()
      if (email === session.email) return
      // await AccountManagement.changeUsername({ email: session.email, newUsername: email })
      Navigation.success("Verification Link sent to new email! Please check your new email to change your email.")
    } catch (error) {
      Navigation.handleFormError(error)
    }
  }


  return <section className="max-w-screen-sm mx-auto">
    <a href="/">{ '<- Back' }</a>
    <h1>Settings</h1>

    <Form sp={ searchParams } className="
    [&>section]:mb-16
    [&_h2]:mb-4
    ">
      <section className="
      [&>section]:flex
      [&>section]:justify-between
      [&>section]:items-center
      [&>section]:gap-2
      ">

        <h2>Account</h2>

        <IfNotVerified>
          <section>
            <span>Your email is not verified. Please verify your email</span>
            <button type="submit" formAction={ verifyAction }>Verify Email</button>
          </section>
        </IfNotVerified>

        <section>
          <span>Delete Account <br /><IfNotVerified><span className="opacity-20">Please verify your email to delete account</span></IfNotVerified></span>
          <IfVerified><button data-destructive formAction={ deleteUserAction }>Delete Account</button></IfVerified>
        </section>

        <section>
          <span>Change Password <br /><IfNotVerified><span className="opacity-20">Please verify your email to change password</span></IfNotVerified></span>
          <IfVerified><a href="/settings/changepassword">Change Password</a></IfVerified>
        </section>

        <section>
          <span>Log out</span>
          <button formAction={ logoutAction }>Log out</button>
        </section>

      </section>

      <section className="
      [&>section]:mb-8
      ">

        <h2>Profile</h2>

        <section className="flex-col">
          <label htmlFor="username" className="w-full opacity-100">
            Username <br />
          </label>

          <section className="flex flex-row gap-4 w-full">
            <input name="username" defaultValue={ session.username } />
            <button type="submit" formAction={ changeUsernameAction }>Change username</button>
          </section>
        </section>

        <section>
          <label htmlFor="email" className="w-full opacity-100">
            Email <br />
          </label>

          <section className="flex flex-row gap-4 w-full">
            <input name="username" defaultValue={ session.email } />
            <button type="submit" formAction={ changeUsernameAction }>Change email</button>
          </section>

        </section>
        
      </section>

    </Form >
  </section>
}

