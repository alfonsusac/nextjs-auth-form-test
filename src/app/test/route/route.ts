import { User } from "@/model/user"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const header = headers()
  console.log(Object.fromEntries(header.entries()))
  await User.create({
    email: "alfonssusac@gmail.com",
    username: "alfonso",
    password: "alfonso",
    provider: "password"
  })
  return NextResponse.json(Object.fromEntries(header.entries()))
}

export const dynamic = 'force-dynamic'