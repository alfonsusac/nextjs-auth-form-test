export function SearchParamStateCallout({ searchParams }: {
  searchParams?: { [key: string]: string } | null
}) {
  return <>
    { searchParams?.success && <div data-callout-success>{ searchParams.success }</div> }
    { searchParams?.error && <div data-callout-error>{ searchParams.error }</div> }
  </>
}
