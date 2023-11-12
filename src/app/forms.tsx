import { Cookie } from "@/lib/cookies"
import { createForm } from "@/lib/validations/formData"

export const emailAutofill = Cookie.create("email-autofill", { maxAge: 3600 })


export const registerForm = createForm({
  'eml': {
    label: "Email",
    required: "Email is required",
    email: "Email has to be in email format",
    persistValue: {}
  },
  'usr': {
    label: "Username",
    required: "Username is required!",
    text: "Username has to be a text!",
    persistValue: {}
  },
  'pwd': {
    label: "Password",
    required: "Password is required!",
    password: "Password has to be a text!",
  },
})