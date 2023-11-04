import { ComponentProps } from "react"

export function Input(p: {
  name: string
  label: string
} & Pick<ComponentProps<"input">, "type">){
  return (
    <>
      <label htmlFor={ p.name }>{ p.label }</label>
      <input name={ p.name } type={ p.type } />
    </>
  )
}