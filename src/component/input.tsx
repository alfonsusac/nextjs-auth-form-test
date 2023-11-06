import { ComponentProps } from "react"

export function Input(p: {
  label: string
} & ComponentProps<"input">) {
  
  const { label, ...rest } = p;
  return (
    <>
      <label htmlFor={ p.name }>{ label }</label>
      <input {...rest} />
    </>
  )
}