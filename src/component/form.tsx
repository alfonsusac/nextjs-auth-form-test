import { SearchParamStateCallout } from "./searchParams"

export async function Form(p: {
  sp: { [key: string]: string },
  children: React.ReactNode
  className?: string,
}) {
  return (
    <form className={ p.className }>
      <SearchParamStateCallout searchParams={ p.sp } />
      { p.children }
    </form>
  )
}