/* eslint-disable @next/next/no-img-element */
import { IfNotLoggedIn, IfLoggedIn } from "@/component/authentication"
import { Form } from "@/component/form"
import { SVGProps } from "react"


export default function HomePage({ searchParams }: { searchParams: { [key: string]: string } }) {

  return <Form sp={ searchParams }>
    <IfNotLoggedIn>
      <section>

        <h1 className="text-4xl tracking-tight leading-loose mt-12"> Welcome! </h1>
        <p className="text-base mb-8">Authentication using Next.js App routing and server actions</p>

        <a href="/login" data-primary>Get Started</a>
        <a href="https://github.com/alfonsusac/nextjs-auth-form-test">
          <MdiGithub className="me-2 text-lg inline align-[-0.225em]" />
          Github
        </a>

      </section>

      <section className="mt-24">
        <h2 className="text-center mb-8">Features</h2>
        <div className="
        grid gap-1
        grid-cols-2 md:grid-cols-3
        [&_div]:p-6
        [&_h3]:opacity-90
        [&_h3]:text-lg
        [&_h3]:font-medium
        [&_h3]:leading-10
        ">
          <div>
            <h3>Password Hashing</h3>
            <p>Login via password, hashed with argon2id</p>
          </div>
          <div>
            <h3>Passwordless</h3>
            <p>Login without password, verification via email using Resend</p>
          </div>
          <div>
            <h3>Email Verification</h3>
            <p>Verify email after logging in, or when critical action is needed</p>
          </div>
          <div>
            <h3>Forgot Password</h3>
            <p>Send email verification when password is forgotton to reset to new password</p>
          </div>
          <div>
            <h3>JWT</h3>
            <p>Stores session state in the client, authenticating user without accessing database</p>
          </div>
        </div>
      </section>

      <section className="mt-24 mb-48">
        <h2 className="text-center mb-8">Technologies</h2>
        <div className="
        flex gap-2
        justify-center
        [&_div]:p-4
        [&_div]:w-48
        [&_div]:text-center
        [&_h3]:opacity-90
        [&_h3]:text-lg
        [&_h3]:font-medium
        [&_h3]:mt-4
        ">
          <div>
            <LogosNextjsIcon className="text-6xl"/>
            <h3>Next.js</h3>
            <p>Full stack Javascript Framework</p>
          </div>
          <div>
            <SkillIconsPrisma className="text-6xl"/>
            <h3>Prisma</h3>
            <p>Database ORM</p>
          </div>
          <div>
            <img className="w-[3.75rem] h-[3.75rem] inline rounded-xl" alt="Resend Email API Logo" src="data:image/jpeg;base64,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" />
            <h3>Resend</h3>
            <p>Email API</p>
          </div>
        </div>
      </section>

    </IfNotLoggedIn>
    <IfLoggedIn>
      <h2>To-do</h2>
      You are doing great! Keep it up!
    </IfLoggedIn>
  </Form>
}





export function LogosNextjsIcon(props: SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256" { ...props }><defs><linearGradient id="logosNextjsIcon0" x1="55.633%" x2="83.228%" y1="56.385%" y2="96.08%"><stop offset="0%" stopColor="#FFF"></stop><stop offset="100%" stopColor="#FFF" stopOpacity="0"></stop></linearGradient><linearGradient id="logosNextjsIcon1" x1="50%" x2="49.953%" y1="0%" y2="73.438%"><stop offset="0%" stopColor="#FFF"></stop><stop offset="100%" stopColor="#FFF" stopOpacity="0"></stop></linearGradient><circle id="logosNextjsIcon2" cx="128" cy="128" r="128"></circle></defs><mask id="logosNextjsIcon3" fill="#fff"><use href="#logosNextjsIcon2"></use></mask><g mask="url(#logosNextjsIcon3)"><circle cx="128" cy="128" r="128"></circle><path fill="url(#logosNextjsIcon0)" d="M212.634 224.028L98.335 76.8H76.8v102.357h17.228V98.68L199.11 234.446a128.433 128.433 0 0 0 13.524-10.418Z"></path><path fill="url(#logosNextjsIcon1)" d="M163.556 76.8h17.067v102.4h-17.067z"></path></g></svg>
}


export function SkillIconsPrisma(props: SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256" { ...props }><g fill="none"><rect width="256" height="256" fill="#677EEB" rx="60"></rect><path fill="#F7FAFC" fillRule="evenodd" d="M52.658 165.183a9.385 9.385 0 0 1-.075-9.929L123.044 40.32c3.919-6.393 13.382-5.834 16.521.975l64.369 139.631c2.388 5.181-.361 11.277-5.826 12.917l-100.13 30.039a9.384 9.384 0 0 1-10.622-3.964l-34.698-54.735Zm78.515-91.257c.679-3.382 5.312-3.87 6.68-.703l44.401 102.74a3.518 3.518 0 0 1-2.224 4.768l-69.182 20.652c-2.543.759-4.979-1.463-4.456-4.065l24.781-123.392Z" clipRule="evenodd"></path></g></svg>
}










async function DelayedAction() {
  await delay(2000)
  console.log("Delayed?")
  return <div>Test</div>
}

async function delay(msecs: number) {
  return new Promise((resolve) => setTimeout(resolve, msecs))
}


export function MdiGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"></path></svg>
  )
}