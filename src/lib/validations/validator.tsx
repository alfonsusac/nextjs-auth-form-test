type ValidationErrorType = "FieldRequired" | "FieldNotAText" | "FieldNotANumber"

export type ValidationError = {
  field: string,
  type: ValidationErrorType
}

import { ComponentProps } from "react"

export class Field {
  attributes: ComponentProps<"input"> = {}
  validator: ({ fn: (data: FormDataEntryValue | null) => boolean, type: ValidationErrorType })[] = []

  constructor(
    public name: string,
    public label: string,
  ) { 
    this.attributes.name = this.name
  }

  required() {
    this.attributes.required = true
    this.validator.push({
      fn: data => !data,
      type: "FieldRequired"
    })
  }

  text() {
    this.attributes.type = "text"
    this.validator.push({
      fn: data => typeof data !== "string",
      type: "FieldNotAText"
    })
  }

  number() {
    this.attributes.type = "number"
    this.validator.push({
      fn: data => typeof data !== "number",
      type: "FieldNotANumber"
    })
  }

  password() {
    this.attributes.type = "password"
  }
  email() {
    this.attributes.type = "email"
    // add server-side email validator here
  }

  parse(input: FormDataEntryValue) {
    
  }
}