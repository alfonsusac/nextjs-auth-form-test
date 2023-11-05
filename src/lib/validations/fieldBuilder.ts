const i: ValidatorBuilder = {
  required: true,
  number: {
    max: 3,
    min: 4,
    integer: true
  },
}
const j: ValidatorBuilder = {
  text: {
    max: 5,
    min: 3,
    email: true,
  }
}

type ValidatorBuilder =
  | {
    required?: true
  }
  & (
    // TEXT 
    | {
      number?: undefined
      text: GeneralTextValidator & (
        {
          email?: undefined
          url?: undefined
          password?: boolean
        } | {
          email?: boolean
        } | {
          url?: boolean
        }
      )
    }

    // NUMBER
    | {
      number: {
        integer?: true
        max?: number
        min?: number
      }
    }

    // TIME
    | {

    }
  )

type GeneralTextValidator = {
  max?: number
  min?: number
  pattern?: ({ errormsg: string; validator: (val: string) => boolean })[]
}
type SpecificTextValidator = {

} | {

}