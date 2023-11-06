const text: ValidatorOptions = {
  label: "sdfasdf",
  text: {}
}

export type ValidatorOptions =
  | {
    label: string
    required?: string
  }
  & (
    | {
      // TEXT 
      number?: undefined
      text?: {} | string,
      email?: undefined
      url?: undefined
      max?: number
      min?: number
      pattern?: ({ errormsg: string; validator: (val: string) => boolean })[]
    }
    | {
      password?: {} | string
    }
    | {
      email?: {} | string
    }
    | {
      url?: {} | string
    }
    | {
      // NUMBER
      number: {}
      integer?: true
      max?: number
      min?: number
      pattern?: ({ errormsg: string; validator: (val: string) => boolean })[]
    }
    | {
      // FILE
      file?: {} | string
    }
  ) & {
    [key: string]: {} | string
  }


