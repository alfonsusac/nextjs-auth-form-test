import ms, { StringValue } from "@/../ms/dist"

export default ms
export type { StringValue }


export class ExpiryDate {
  constructor(private readonly msstring: StringValue) { }
  readonly ms = ms(this.msstring)
  readonly second = this.ms / 1000
  readonly getDate = () => new Date(Date.now() + this.ms)
}