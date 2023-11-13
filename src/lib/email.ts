import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export namespace Email {
  export async function verifyViaEmail(input: {
    recipient: string,
    subject: string,
    text: string,
  }) {
    return await resend.emails.send({
      from: "Verification <verification@alfon.dev>",
      to: input.recipient,
      subject: input.subject,
      text: input.text,
    }).catch(error => {
      console.log("Error Sending Email:")
      console.log(error)
      throw error
    })
  }
}
