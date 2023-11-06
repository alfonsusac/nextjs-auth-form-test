import { cookies } from "next/headers"

export namespace Cookie {
  export function create(
    key: string,
    defaultOptions?: {
      domain?: string
      expires?: number | Date 
      httpOnly?: boolean
      maxAge?: number
      path?: string
      priority?: "high" | "low" | "medium"
      sameSite?: true | false | "lax" | "strict" | "none" 
      secure?: boolean
    }
  ) {
    return {
      get() {
        return cookies().get(key)
      },
      getAll() {
        return cookies().getAll(key)
      },
      has() {
        return cookies().has(key)
      },
      set(value: string) {
        return cookies().set(key, value, defaultOptions)
      }
    }
  }
}