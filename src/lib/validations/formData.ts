import { Cookie, ReadOnlyCookie } from "../cookies"
import { ClientError } from "../error"
import { ValidatorOptions } from "./fieldBuilder"
import { Field, ValidationError } from "./validator"


export function createForm<FormShape extends { [key: string]: ValidatorOptions }>(
  formDescription: FormShape
) {
  const fields: { [key: string]: Field } = {}
  const defaultFieldValueReadOnlyCookies: {
    [key in keyof FormShape]:
    FormShape[key]["file"] extends {} ? undefined :
    FormShape[key]["persistValue"] extends {} ? ReadOnlyCookie : undefined
  } = {} as any
  const defaultFieldValueCookies: {
    [key in keyof FormShape]:
    FormShape[key]["file"] extends {} ? undefined :
    FormShape[key]["persistValue"] extends {} ? Cookie : undefined
  } = {} as any


  for (const fieldName in formDescription) {



    // input
    const fieldDesc = formDescription[fieldName]
    const label = fieldDesc.label
    // output
    const field = fields[fieldName] = new Field(fieldName, label)

    // set defaultvalue cookie
    if (!fieldDesc.file && fieldDesc.persistValue) {
      const cookie = Cookie.create(fieldName)
      defaultFieldValueCookies[fieldName] = cookie as any
      defaultFieldValueReadOnlyCookies[fieldName] = cookie.readOnly as any
    }

    // Validations handling
    if ("required" in fieldDesc && fieldDesc.required) {
      field.required()
    }
    if ("text" in fieldDesc && fieldDesc.text) {
      field.text()
    }
    if ("password" in fieldDesc && fieldDesc.password) {
      field.password()
    }
    if ("email" in fieldDesc && fieldDesc.email) {
      field.email()
    }

    // More to be added :eyes: (add more here)
  }

  const form: {

    // To be used in input components
    fields: { [key in keyof FormShape]: Field },

    // To be used in server-side validation
    // - return array of error if `checkAll` is true
    // - for each field:
    //   - return string if key is not file
    //   - return file if key is file
    validate: <CheckAll extends boolean | undefined = undefined>(formData: FormData, checkAll?: CheckAll) => (
      (
        CheckAll extends true ? {
          [key in keyof FormShape]:
          FormShape[key]['required'] extends {} ?
          FormShape[key]["file"] extends {} ? File : string :
          FormShape[key]["file"] extends {} ? File : string | undefined
        } & {
          error: ValidationError[]
        } : {
          [key in keyof FormShape]:
          FormShape[key]['required'] extends {} ?
          FormShape[key]["file"] extends {} ? File : string :
          FormShape[key]["file"] extends {} ? File : string | undefined
        }
      )
    )

    // To be used to provide default values.
    // - only if enabled
    defaultValues: {
      [key in keyof FormShape]:
      FormShape[key]["file"] extends {} ? undefined :
      FormShape[key]["persistValue"] extends {} ? ReadOnlyCookie : undefined
    }
  } = {
    fields: fields as { [key in keyof FormShape]: Field },
    validate: (formData: FormData, checkAll?: boolean) => {
      const fieldValues: { [key: string]: string | File | null } = {}
      const errors: ValidationError[] = []

      // Iterate each field in a form
      for (const field in fields) {

        // Get input value of field
        const fieldValue = formData.get(field)

        if (typeof fieldValue === "string") {
          defaultFieldValueCookies[field]?.set(fieldValue)
        }

        // Iterate each validator in a field.
        for (const validator of fields[field].validator) {

          // If it breaks validation rules then return
          if (validator.fn(fieldValue)) {
            if (!checkAll)
              throw new ClientError("Invalid input", `Field ${field} is invalid`)
            else
              errors.push({ field, type: validator.type })
          }

        }

        fieldValues[field] = fieldValue as string
      }

      // Else, if it has any error then return later
      if (checkAll && errors.length > 0)
        return {
          error: errors as ValidationError[]
        }
      else
        return {
          ...fieldValues as { [key in keyof FormShape]: FormShape[key]["file"] extends {} ? File : string },
        } as any
    },
    defaultValues: defaultFieldValueReadOnlyCookies
  }

  return form
}



export function validateFormData(
  formData: FormData,
  validation: {
    [key: string]: (formDataItem: FormDataEntryValue) => void
  },
  onError:
    (field: string, message: string) => void
) {
  const error = onError
  for (const i in validation) {

    const field = formData.get(i)
    if (!field) error(i, 'Field ')

  }
}