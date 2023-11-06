import { Referer } from "./referrer"
import * as Navigation from "next/navigation"

export namespace Error {
  export function setSearchParam(errorMessages: {[key: string]: string}): never {
    const searchParams = Referer.getSearchParam()
    for (const i in errorMessages) {
      searchParams.set(i, errorMessages[i])
    }
    Navigation.redirect('?' + searchParams.toString())
  }
  export function handleActionError(error: any | unknown) {
    if (error.message === "NEXT_REDIRECT")
      throw error
  }
}

export namespace Response {
  export function setSearchParam(errorMessages: { [key: string]: string }): never {
    const searchParams = Referer.getSearchParam()
    for (const i in errorMessages) {
      searchParams.set(i, errorMessages[i])
    }
    Navigation.redirect('?' + searchParams.toString())
  }

}