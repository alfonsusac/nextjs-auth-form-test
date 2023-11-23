import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Request } from "./request"
import * as Navigation from "next/navigation"


export namespace Response {
  export function setSearchParam(errorMessages: { [key: string]: string }): never {
    const searchParams = Request.getSearchParam()
    for (const i in errorMessages) {
      searchParams.set(i, errorMessages[i])
    }
    Navigation.redirect('?' + searchParams.toString())
  }
}

export function redirect(path: string | undefined, query?: string): never {
  console.log("Redirecting to: " + path)
  Navigation.redirect(`${path}${query ? `?${query}` : ''}`)
}
export function returnSuccessMessage(msg: string): never {
  const searchParams = Request.getSearchParam()
  searchParams.set("success", msg)
  searchParams.delete("error")
  redirect('', searchParams.toString())
}
export function returnErrorMessage(error: string): never {
  const searchParams = Request.getSearchParam()
  searchParams.set("error", error)
  searchParams.delete("success")
  redirect('', searchParams.toString())
}
export function returnUnknownError(): never {
  console.log("Returning Unknown Error Message")
  returnErrorMessage("Unknown server error")
}

export function isPrismaUniqueConstraintError(error: any, field: string) {
  if (
    error instanceof PrismaClientKnownRequestError
    && error.code === "P2002"
    && JSON.stringify(error.meta).includes(field)
  ) {
    return true
  } else {
    return false
  }
}
export function handleUniqueConstraintError(error: any, field: string, errorMessage: string): void | never {
  if (isPrismaUniqueConstraintError(error, field))
    throw new ClientError(errorMessage)
}


/**
 * Comprises of three things
 * - if `redirect()`, throw error
 * - if ClientError, return same path `?error=clientMessage`
 * - if Unknown, return same path `?error=Unknown Server Error`
 */
export function handleActionError(error: any) {

  if (error.message === "NEXT_REDIRECT") throw error

  if (error instanceof ClientError) {
    returnErrorMessage(error.clientMessage)
  }
  
  console.log("Unknown Server Error Occurred")
  console.log(error)

  returnUnknownError()
}








export class DeveloperError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, DeveloperError.prototype)
  }
}


export class ClientError extends Error {
  constructor(
    public readonly clientMessage: string,
    serverMessage: string = clientMessage
  ) {
    super(serverMessage)
    Object.setPrototypeOf(this, ClientError.prototype)
  }
}

export class InvalidCredentialClientError extends ClientError {
  constructor(servermsg: string) {
    super("Invalid Credentials", servermsg)
    Object.setPrototypeOf(this, InvalidCredentialClientError.prototype)
  }
}

export class BadRequestClientError extends ClientError {
  constructor(servermsg: string) {
    super("Bad Request", servermsg)
    Object.setPrototypeOf(this, BadRequestClientError.prototype)
  }
}
