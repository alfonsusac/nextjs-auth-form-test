import { ValidatorOptions } from "./fieldBuilder"
import { Field, ValidationError } from "./validator"


type If<X, Y, T, F> = X extends Y ? T : F

export function createForm<FormShape extends { [key: string]: ValidatorOptions }>(
  formDescription: FormShape
) {
  const fields: { [key: string]: Field } = {}

  for (const fieldName in formDescription) {
    // input
    const fieldDesc = formDescription[fieldName]
    const label = fieldDesc.label
    // output
    const field = fields[fieldName] = new Field(fieldName, label)

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
    validate: <T extends boolean | undefined = undefined>(formData: FormData, checkAll?: T) => (
      ({ ok: false, error: T extends true ? ValidationError[] : ValidationError } |
        ({ ok: true } & { [key in keyof FormShape]:
          FormShape[key]['required'] extends {} ?
          FormShape[key]["file"] extends {} ? File : string :
          FormShape[key]["file"] extends {} ? File : string | undefined
        }))
    )

  } = {
    fields: fields as { [key in keyof FormShape]: Field },
    validate: (formData: FormData, checkAll?: boolean) => {
      const fieldValues: { [key: string]: string | File | null } = {}
      const errors: ValidationError[] = []

      // Iterate each field in a form
      for (const field in fields) {

        // Get input value of field
        const fieldValue = formData.get(field)

        // Iterate each validator in a field.
        for (const validator of fields[field].validator) {

          // If it breaks validation rules then return
          if (validator.fn(fieldValue)) {
            if (!checkAll)
              return {
                ok: false,
                error: {
                  field,
                  type: validator.type
                } as any
              }
            else
              errors.push({ field, type: validator.type })
          }

        }

        fieldValues[field] = fieldValue as string
      }

      // Else, if it has any error then return later
      if (checkAll && errors.length > 0)
        return {
          ok: false,
          error: errors as ValidationError[]
        }
      else
        return {
          ok: true,
          ...fieldValues as { [key in keyof FormShape]: FormShape[key]["file"] extends {} ? File : string }
        }

    }
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