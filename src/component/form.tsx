import { SearchParamStateCallout } from "./searchParams"

export async function Form(p: {
  searchParams: { [key: string]: string },
  children: React.ReactNode
}) {
  return (
    <form>
      <SearchParamStateCallout searchParams={ p.searchParams } />
      {p.children}
    </form>
  )
}