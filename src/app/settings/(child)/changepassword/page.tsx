import { LoggedInUser, changePassword } from "@/api/user-management"
import { sendEmailVerification } from "@/api/verification"
import { Form } from "@/component/form"
import { Input } from "@/component/input"
import { handleActionError, redirect, returnSuccessMessage } from "@/lib/error"
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
      <h2>Change Password</h2>
      <p>You do not have a password when registered using Magic links.</p>
      <br />
      <a href="/settings/createpassword" data-primary>Create Password</a>
    </>

  if (!await LoggedInUser.isVerified()) {
    return <>
      <h2>Change Password</h2>
      <p>You need to verify your email before changing your password</p>
      <Form sp={ searchParams }>
        <button type="submit" formAction={ async () => {

          "use server"
          const session = await LoggedInUser.getSession()
          await sendEmailVerification(session.username, session.email)
          returnSuccessMessage('Email sent! Check your email to verify')

        } }>Verify</button>
      </Form>
    </>
  }


  return <>
    <h2>Change Password</h2>
    <Form sp={ searchParams }>
      <Input { ...form.fields.oldPassword.attributes } label={ form.fields.oldPassword.label } />
      <Input { ...form.fields.newPassword.attributes } label={ form.fields.newPassword.label } />
      <br />
      <button type="submit" formAction={ async (formData) => {


        "use server"
        try {
          const { oldPassword, newPassword } = form.validate(formData)
          await changePassword({ oldPassword, newPassword })
          redirect('/settings', 'success=Password successfully changed')
        }
        catch (error: any) { handleActionError(error) }


      } }>Change Password</button>
    </Form>
  </>

}

