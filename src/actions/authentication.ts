"use server"

import { emailAutofill, loginForm, registerForm, usernameAutofill } from "@/app/forms"
import { User } from "@/model/user"
import { Error } from "@/lib/action"
import { Cryptography } from "@/lib/crypt"
import { redirect } from "next/navigation"

// Logs in user
export async function login(formData: FormData) {

  if (formData.get('usr'))
    usernameAutofill.set(`${formData.get('usr')}`)

  const data = loginForm.validate(formData)
  if (!data.ok) Error.setSearchParam({ error: "Invalid input" })
  const { usr, pwd } = data

  try {
    const user = await User.find(usr)
    if (!user)
      Error.setSearchParam({ error: "User not found!" })

    if (!await Cryptography.verify(user.password, pwd))
      Error.setSearchParam({ error: "Wrong Password!" })

    // successfull authentication

    redirect('/app')

  } catch (error) {
    Error.handleActionError(error)
    Error.setSearchParam({ error: "Unknown Server Error" })
  }
}

// Register user
export async function register(formData: FormData) {

  if (formData.get('usr'))
    usernameAutofill.set(`${formData.get('usr')}`)
  if (formData.get('eml'))
    emailAutofill.set(`${formData.get('eml')}`)

  const data = registerForm.validate(formData)
  if (!data.ok) Error.setSearchParam({ error: "Invalid input" })
  const { eml, usr, pwd } = data

  try {
    const hashedPwd = await Cryptography.hash(pwd)
    await User.create(usr, eml, hashedPwd)
  } catch (error) {
    console.warn(error)
    Error.setSearchParam({ error: "Unknown Server Error" })
  }
  redirect("/")

}