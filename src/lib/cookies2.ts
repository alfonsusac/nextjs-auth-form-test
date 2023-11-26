import { cookies } from "next/headers"
import { logger } from "./logger"
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"

const log = logger("Cookie ", "yellow")
export class Cookie {
  constructor(
    readonly key: string,
    readonly defaultOptions?: Omit<ResponseCookie, "name" | "value">
  ) { }

  get() {
    return cookies().get(this.key)
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
}