import { cookies } from "next/headers"
import { logger } from "./logger"
import { RequestCookie, ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"

const log = logger("Cookie ", "yellow")
export type ReadOnlyCookie = {
  get: () => (string | undefined),
  getAll: () => (RequestCookie[]),
  has: () => (boolean)
}
export class Cookie {
  constructor(
    readonly key: string,
    readonly defaultOptions?: Omit<ResponseCookie, "name" | "value">
  ) { }

  get() {
    return cookies().get(this.key)?.value
  }
  getAll() {
    return cookies().get(this.key)
  }
  has() {
    return cookies().has(this.key)
  }
  set(value: string) {
    return cookies().set(this.key, value, this.defaultOptions)
  }
  delete() {
    try {
      return cookies().delete(this.key)
    } catch (error) {
      log("delete error")
      console.log(error)
    }
  }
  get readOnly(): ReadOnlyCookie {
    return {
      get: () => cookies().get(this.key)?.value,
      getAll: () => cookies().getAll(this.key),
      has: () => cookies().has(this.key)
    }
  }
}