import { RequestCookie, ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"

export type Cookie = {
  get(): RequestCookie | undefined
  getAll(): RequestCookie[]
  has(): boolean
  set(value: string): ResponseCookies
  readOnly: ReadOnlyCookie
  delete(): ResponseCookies
}
export type ReadOnlyCookie = {
  get(): string | undefined
}

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
      secure?: boolean,

      signed?: boolean
    }
  ): Cookie {
    const { ...defaultCookieOption } = defaultOptions ?? {}

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
      set(value) {
        return cookies().set(key, value, defaultCookieOption)
      },
      readOnly: {
        get: () => {
          return cookies().get(key)?.value
        }
      },
      delete() {
        return cookies().delete(key)
      }
    }
  }
}