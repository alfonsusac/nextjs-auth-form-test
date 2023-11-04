import { Input } from "@/component/input"
import { ComponentProps } from "react"

export function createForm(
  formShapeDescription:
    {
      [key: string]: {
        name: string,
        label: string,
        validation: (`string` | `required` | `password` | `max-${number}` | `min-${number}`)[]
      }
    }
) {
  const form: {
    [key in keyof typeof formShapeDescription]: {
      attributes: ComponentProps<"input">,
      attributesWithLabel: ComponentProps<"input"> & { htmlFor: string }
      validator: ((data: FormDataEntryValue) => void)[]
    }
  } = {}

  for (const fieldName in formShapeDescription) {
    // input
    const fieldDescription = formShapeDescription.field
    const validation = fieldDescription.validation
    const label = fieldDescription.label
    // output
    const { attributes, attributesWithLabel, validator } = form[fieldName]
    const field = form[fieldName]

    // assign name and label
    attributes.name = fieldDescription.name
    attributesWithLabel.htmlFor = fieldDescription.name

    // initialize validator
    field.validator = []

    // Validations handling
    if (validation.includes('string')) {
      attributes.type = 'text'
      validator.push((data: FormDataEntryValue) => {
        if(typeof data !== "string") throw new Error(`Field ${label} has to be a text!`)
      })
    }

    if (validation.includes('password')) {
      attributes.type = 'password'
    }

    if (validation.includes('required')) {
      attributes.required = true
  
    }

    const max = validation.find(v => v.startsWith('max-')) as `max-${number}` | undefined
    if (max) {
      const maxLetter = parseInt(max.substring(4))
      attributes.max = maxLetter
    }

    const min = validation.find(v => v.startsWith('min-')) as `min-${number}` | undefined
    if (min) {
      const minLetter = parseInt(min.substring(4))
      attributes.min = minLetter
    }

    // More to be added :eyes: (add more here)


    // Copy all of attributes to attributesWithLabel
    Object.assign(field.attributesWithLabel, field.attributes)
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