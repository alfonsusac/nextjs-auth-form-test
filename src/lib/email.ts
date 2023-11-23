import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export namespace Email {

  function log(e:any) { console.log(`[Email] - ${e}`) }

  export async function verifyViaEmail(input: {
    recipient: string,
    subject: string,
    text: string,
  }) {
    log("Sending Email Verification to Recipient")

    const res = await resend.emails.send({
      from: "Verification <verification@alfon.dev>",
      to: input.recipient,
      subject: input.subject,
      text: input.text,
    }).catch(error => {
      log("Error Sending Email:")
      console.log(error)
      throw error
    })

    log(`Email sent - ${res.data?.id}`)

    return res
  }
  
}
