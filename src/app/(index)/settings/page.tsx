import { Authentication } from "@/api/authentication"
import { Verifications } from "@/api/globals"
import { AccountManagement, LoggedInUser } from "@/api/account"
import { IfApp2FADisabled, IfApp2FAEnabled, IfNotUsingMagicLink, IfNotVerified, IfUsingMagicLink, IfVerified } from "@/component/authentication"
import { Form } from "@/component/form"
import { Navigation } from "@/lib/error"
import { ClientError } from "@/lib/error/class"
import { sendEmailVerification } from "@/api/verification"

export default async function Page({ searchParams }: any) {

  const user = await LoggedInUser.getUser()

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

        <p className="opacity-60 italic">Logged in via Magic Link</p>

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
          <span>Change Password<br />
            <IfNotVerified><span className="opacity-20">Please verify your email to change password</span></IfNotVerified>
            <IfUsingMagicLink><span className="opacity-20">You cant change password when logged in using magic link.</span></IfUsingMagicLink>
          </span>
          <IfNotUsingMagicLink>
            <IfVerified><a href="/settings/changepassword">Change Password</a></IfVerified>
          </IfNotUsingMagicLink>
        </section>

        <IfApp2FADisabled>
          <section>
            <span>Enable 2FA via Authenticator<br />
              <IfNotVerified><span className="opacity-20">Please verify your email to enable 2FA</span></IfNotVerified>
              <IfUsingMagicLink><span className="opacity-20">You dont need Authenticator when logged in using magic link</span></IfUsingMagicLink>
            </span>
            <IfNotUsingMagicLink>
              <IfVerified><a href="/settings/setup2fa">Enable 2FA</a></IfVerified>
            </IfNotUsingMagicLink>
          </section>
        </IfApp2FADisabled>

        <IfApp2FAEnabled>
          <section>
            <span>Disable 2FA via Application <br /><IfNotVerified><span className="opacity-20">Please verify your email to disable 2FA</span></IfNotVerified></span>
            <IfVerified><button data-destructive data-destructiven formAction={ disableApp2FAAction }>Disable 2FA</button></IfVerified>
          </section>
        </IfApp2FAEnabled>

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
            <input name="username" defaultValue={ user.username } />
            <button type="submit" formAction={ changeUsernameAction }>Change username</button>
          </section>
        </section>

        <section>
          <label htmlFor="email" className="w-full opacity-100">
            Email <br />
          </label>
          <IfVerified>
            <section className="flex flex-row gap-4 w-full">
              <input name="email" defaultValue={ user.email } />
              <button type="submit" formAction={ changeEmailAction }>Change email</button>
            </section>
          </IfVerified>
          <IfNotVerified>
            <p>{ user.email }</p>
            <span className="opacity-20">Please verify your email to change email</span>
          </IfNotVerified>
        </section>

      </section>
    </Form >
  </section>
}


async function verifyAction() {
  "use server"
  const session = await Authentication.requireSession()
  await sendEmailVerification(session.username, session.email)
  Navigation.success('Email sent! Check your email to verify')
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

async function disableApp2FAAction() {
  "use server"
  try {
    const session = await Authentication.requireSession()
    await AccountManagement.disable2FA(session)
    Navigation.success('2FA Disabled!')
  } catch (error) {
    Navigation.handleFormError(error)
  }
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

async function changeUsernameAction(formData: FormData) {
  "use server"
  try {
    const username = formData.get('username') as string
    if (!username) ClientError.invalidInput('Username is required')
    const session = await Authentication.requireSession()
    if (username === session.username) return
    await AccountManagement.changeUsername({
      email: session.email,
      newUsername: username,
      oldUsername: session.username
    })
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

    await Verifications.changeEmailVerification.send(session.email, {
      username: session.username,
      email: email
    })

    Navigation.success("Verification Link sent to new email! Please check your new email to change your email.")
  } catch (error) {
    Navigation.handleFormError(error)
  }
}