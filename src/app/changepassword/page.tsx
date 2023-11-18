import { getCurrentUser, getUserAndRedirectToHomeIfNotAuthenticated } from "@/api/authentication"
import { Input } from "@/component/input"
import { SearchParamStateCallout } from "@/component/searchParams"
import { Cryptography } from "@/lib/crypto"
import { DeveloperError, handleActionError, redirect, returnErrorMessage } from "@/lib/error"
import { createForm } from "@/lib/validations/formData"
import { Password } from "@/model/user"

const form = createForm(
  {
    'oldpassword': {
      label: "Old Password",
      required: "Please fill in old password",
      password: "Password has to be a text!",
    },
    'newpassword': {
      label: "New Password",
      required: "Please fill in old password",
      password: "Password has to be a text!",
    }
  }
)


export default function ChangePassword({ searchParams }: any) {
  return (
    <>
      <h2>Change Password</h2>
      <form>
        <SearchParamStateCallout searchParams={ searchParams } />
        <Input { ...form.fields.oldpassword.attributes } label={ form.fields.oldpassword.label } />
        <Input { ...form.fields.newpassword.attributes } label={ form.fields.newpassword.label } />
        <br />
        <button type="submit" formAction={
          async (formData) => {
            "use server"
            try {
              const user = await getUserAndRedirectToHomeIfNotAuthenticated()

              const { oldpassword, newpassword } = form.validate(formData)

              const storedPassword = await Password.find(user.username)
              if (!storedPassword) throw new DeveloperError("User not found")

              const valid = await Cryptography.verify(storedPassword.value, oldpassword)

              if (!valid)
                returnErrorMessage("Password doesn't match! Please enter old password.")

              const hashedNewPassword = await Cryptography.hash(newpassword)
              await Password.update(user.username, storedPassword.value, hashedNewPassword)

              redirect('/', 'success=Password successfully changed')
            }
            catch (error: any) { handleActionError(error) }

          }
        }>
          Change Password
        </button>
      </form>
    </>
  )
}