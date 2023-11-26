import { ClientError } from "@/lib/error/class"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export namespace PrismaUtil {

  function uniqueConstraintError(error: any) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      error.message.includes('Unique constraint')
    ) {
      // Ugly but error typing is not yet gere
      return (error as any).meta['target'][0] as string
    }
  }
  function recordNotFoundError(error: any) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return (error as any).meta['cause'] as string
    }
  }

  export function throwIfConstraintError(error: any, field: string, label: string) {
    if (uniqueConstraintError(error) === field)
      throw ClientError.invalidInput(label + " is already taken")
  }
  export function throwIfRecordNotFound(error: any, message: string) {
    if (recordNotFoundError(error))
      throw ClientError.invalidInput(message)
  }
}