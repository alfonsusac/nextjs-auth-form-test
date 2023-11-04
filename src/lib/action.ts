import { Referer } from "./referrer"
import * as Navigation from "next/navigation"

export namespace Error {
  export function redirect(errorMessages: {[key: string]: string}) {
    const sp = Referer.getSearchParam()
    for (const i in errorMessages) {
      sp.append(i, errorMessages[i])
    }
    Navigation.redirect('?' + sp.toString())
  }
}