import { headers } from "next/headers"
import { NextResponse } from "next/server"

export function GET() {
  const header = headers()
  // console.log(JSON.stringify(header, null, 1))
  
  console.log(Object.fromEntries(header.entries()))
  return NextResponse.json(Object.fromEntries(header.entries()))
}

export const dynamic = 'force-dynamic'