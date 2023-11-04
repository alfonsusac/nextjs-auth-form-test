import { headers } from "next/headers"

export namespace Referer{
  export function get() {
    const referer = headers().get('referer')
    if (!referer) throw new Error('Referrer header not found!')
    return referer
  }
  export function getURL() {
    return new URL(Referer.get())
  }
  export function getSearchParam() {
    return new URLSearchParams(Referer.getURL().searchParams)
  }
}