import { Referer } from "./referrer"
import * as Navigation from "next/navigation"

export namespace Error {
  export function setSearchParam(errorMessages: { [key: string]: string }): never {

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
  export function includes(error: any | unknown, phrase: string) {
    return JSON.stringify(error).includes(phrase)
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

export enum ErrorMessage {
  UnknownError = "Unknown Server Error",

}

export function redirectWithError(error: string): never {

  const searchParams = Referer.getSearchParam()
  searchParams.set("error", error)
  Navigation.redirect('?' + searchParams.toString())
}
export function redirectWithUnknownError(): never {
  redirectWithError("Unknown server error")
}
export function redirectSuccess(msg: string): never {
  const searchParams = Referer.getSearchParam()
  searchParams.set("success", msg)
  Navigation.redirect('?' + searchParams.toString())
}