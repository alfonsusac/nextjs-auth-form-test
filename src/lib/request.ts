import { headers } from "next/headers"

type protocol = "http" | "https"
type domain = string

export namespace Request{

  /**
   * Retrieve the host
   * @returns 
   */
  export function getServerBaseURL(): `${protocol}://${domain}` {
    const domain = headers().get('host')
      ?? headers().get('x-forwarded-host')
      ?? undefined
    
    if (!domain) throw new Error("Domain not found!")
    if (domain.includes("localhost"))
      return `http://${domain}`

    const protocol = headers().get('x-forwarded-proto')
      ?? undefined 
    
    if (!protocol)
      throw new Error("Protocol Can't be determined")

    return `${protocol as protocol}://${domain}`
  }
  export function getReferer() {
    const referer = headers().get('referer')
    if (!referer)
      throw new Error('Referrer header not found!')
    return referer
  }
  
  export function getURL() {
    return new URL(Request.getReferer())
  }

  export function getSearchParam() {
    try {
      return new URLSearchParams(Request.getURL().searchParams)
    } catch (error) {
      return new URLSearchParams()      
    }
  }
}