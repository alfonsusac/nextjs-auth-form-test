import { Authentication } from "@/api/authentication"
import { LoggedInUser, AccountManagement } from "@/api/user-management"
import { sendEmailVerification } from "@/api/verification"
import { Form } from "@/component/form"
import { Input } from "@/component/input"
import { Navigation } from "@/lib/error"
import { createForm } from "@/lib/validations/formData"

const form = createForm(
  {
    'oldPassword': {
      label: "Old Password",
      required: "Please fill in old password",
      password: "Password has to be a text!",
    },
    'newPassword': {
      label: "New Password",
      required: "Please fill in old password",
      password: "Password has to be a text!",
    }
  }
)
export default async function ChangePasswordPage({ searchParams }: any) {

  if (await LoggedInUser.usingMagicLink())
    return <>
      <h1>Change Password</h1>
      <p>You do not have a password when registered using Magic links.</p>
      <br />
      <a href="/settings/createpassword" data-primary>Create Password</a>
    </>

  if (!await LoggedInUser.isVerified()) {
    return <>
      <h1>Change Password</h1>
      <p>You need to verify your email before changing your password</p>
      <Form sp={ searchParams }>
        <button type="submit" formAction={ async () => {

          "use server"
          const session = await Authentication.requireSession()
          await sendEmailVerification(session.username, session.email)
          Navigation.success('Email sent! Check your email to verify')

        } }>Verify</button>
      </Form>
    </>
  }


  return <>
    <h1>Change Password</h1>
    <Form sp={ searchParams }>
      <Input { ...form.fields.oldPassword.attributes } label={ form.fields.oldPassword.label } />
      <Input { ...form.fields.newPassword.attributes } label={ form.fields.newPassword.label } />
      <br />
      <button type="submit" formAction={ async (formData) => {


        "use server"
        try {
          const { username } = await Authentication.requireVerifiedSession()
          const { oldPassword, newPassword } = form.validate(formData)
          await AccountManagement.changePassword({ oldPassword, newPassword, username })
          Navigation.redirectTo('/settings', 'success=Password successfully changed')
        }
        catch (error: any) {
          Navigation.handleFormError(error)
        }

        
      } }>Change Password</button>
    </Form>
  </>

}

