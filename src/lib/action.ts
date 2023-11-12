import { Request } from "./referrer"
import * as Navigation from "next/navigation"

export namespace Error {
  export function setSearchParam(errorMessages: { [key: string]: string }): never {

    const searchParams = Request.getSearchParam()
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
    const searchParams = Request.getSearchParam()
    for (const i in errorMessages) {
      searchParams.set(i, errorMessages[i])
    }
    Navigation.redirect('?' + searchParams.toString())
  }

}

export function redirect(path: string | undefined, query?: string ):never {
  console.log("Redirecting to: " + path)
  Navigation.redirect(`${path}${query ? `?${query}` : ''}`)
}
export function returnSuccessMessage(msg: string): never {
  const searchParams = Request.getSearchParam()
  searchParams.set("success", msg)
  searchParams.delete("error")
  Navigation.redirect('?' + searchParams.toString())
}
export function returnErrorMessage(error: string): never {
  const searchParams = Request.getSearchParam()
  searchParams.set("error", error)
  searchParams.delete("status")
  Navigation.redirect('?' + searchParams.toString())
}
export function returnUnknownError(): never {
  returnErrorMessage("Unknown server error")
}

