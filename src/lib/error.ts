import { Request } from "./request"
import * as NextNavigation from "next/navigation"
import { headers } from "next/headers"
import { ClientErrorBaseClass } from "./error/class"
import { development } from "./env"


/**
 * TODO: Forward Link to Destination upon login
 */
export namespace Navigation {

  export function redirectTo(path: string | undefined, query?: string): never {
    console.log("Redirecting to: " + path)
    NextNavigation.redirect(`${path}${query ? `?${query}` : ''}`)
  }

  export function notAuthenticated(): never {
    try { headers() } catch { throw new ClientErrorBaseClass("User not authenticated!") }
    redirectTo('/401')
  }
  export function notVerified(): never {
    try { headers() } catch { throw new ClientErrorBaseClass("User not verified!") }
    redirectTo('/settings', 'error=Please verify your email!')
  }

  
  /**
   * Comprises of three things
   * - if `redirect()`, throw error
   * - if ClientError, return same path `?error=clientMessage`
   * - if Unknown, return same path `?error=Unknown Server Error`
   */
  export function handleFormError(error: any) {
    if (error.message === "NEXT_REDIRECT")
      throw error

    if (error instanceof ClientErrorBaseClass)
      errorMessage(error.clientMessage)

    unknownError(error)
  }
  export function handleVerificationRouteError(error: any, redirectTo: string) {
    if (error.message === "NEXT_REDIRECT") {
      throw error
    }
    if (error instanceof InvalidSearchParam) {
      Navigation.redirectTo('/')
    }
    if (error instanceof ClientErrorBaseClass) {
      Navigation.redirectTo(redirectTo, `error=${error.message}`)
    }
    console.log("Error verifying incoming request")
    console.log(error)
    Navigation.redirectTo(redirectTo, 'error=Verification Failed. Please try again')
  }


  export function success(msg: string): never {
    const searchParams = Request.getSearchParam()
    searchParams.set("success", msg)
    searchParams.delete("error")
    redirectTo('', searchParams.toString())
  }

  export function errorMessage(error: string): never {
    const searchParams = Request.getSearchParam()
    searchParams.set("error", error)
    searchParams.delete("success")
    redirectTo('', searchParams.toString())
  }

  export function unknownError(error: unknown): never {
    console.log("Unknown Server Error Occurred")
    console.log(error)
    if (development) {
      errorMessage(JSON.stringify(error))
    }
    errorMessage("Unknown server error")
  }
}

export class DecodingError extends ClientErrorBaseClass {
  constructor(servermsg: string) {
    super("Invalid Verification Token", servermsg)
  }
}

export class InvalidSearchParam extends ClientErrorBaseClass {
  constructor(msg: string) {
    super(msg)
    console.log("Invalid Search Params: " + msg)
  }
}

