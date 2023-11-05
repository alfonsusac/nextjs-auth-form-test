function getMessageContext(
  ctx: {
    label: string,
    value: string,
  },
  message?: string | (
    (label: string, value: string) => string
  )
) {
  return typeof message === 'function' ? message(ctx.label, ctx.value) : message
}

export type ValidationMessage = string | ((label: string, value: string) => string) | undefined
export type ValidatorFn = (
  context: {
    label: string,
    value: string,
  },
  data: FormDataEntryValue,
) => void

export type Validator = (
  message?: ValidationMessage
) => ValidatorFn


export const validators = {
  required(msg) {
    return (ctx, data) => {
      const errormsg = getMessageContext(ctx, msg)
      if (!data) throw errormsg ?? "One of the field is required!"
    }
  },
  text(msg) {
    return (ctx, data) => {
      const errormsg = getMessageContext(ctx, msg)
      if (typeof data !== "string") throw errormsg ?? "One of the field is not a text!"
    }
  }
} satisfies {
  [key: string]: Validator
}