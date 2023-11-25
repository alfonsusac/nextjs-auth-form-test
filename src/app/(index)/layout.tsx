import { Authentication } from "@/api/authentication"
import { IfLoggedIn, IfNotLoggedIn } from "@/component/authentication"

export default async function IndexLayout({ children }: any) {
  
  const user = await Authentication.getSession()

  return <>
    <Header>
      <section>
        <p>🔒 <span>Next.js Simple Auth</span></p>
        <a href="/">Home</a>
      </section>
      <section>
        <IfNotLoggedIn>
          <a href="/login" data-primary>Log in</a>
          <a href="/register">Register</a>
        </IfNotLoggedIn>
        <IfLoggedIn>
          <p>{ user?.username }</p>
          <a href="/settings">Settings</a>
        </IfLoggedIn>
      </section>
    </Header>
    <Main>{ children }</Main>
  </>
}

export function Header({ children }: any) {
  return <header className="
    flex flex-row items-center justify-between 
    max-w-screen-xl w-full mx-auto  
    px-4
    [&>section]:flex
    [&>section]:items-center
    [&>section:first-of-type>p]:text-xl
    [&>section>p]:font-semibold
    [&>section>p]:text-white
    [&>section>p]:mr-4
    [&>section_span]:hidden
    [&>section_span]:md:inline
  ">
    { children }
  </header>
}

export function Main({ children }: any) {
  return <main className="
    max-w-screen-lg w-full mx-auto
    px-10 pb-24
    break-words
    pt-8

    [&_h2]:opacity-20
    [&_h2]:font-normal
    [&_h2]:text-xl
  ">
    { children }
  </main>
}