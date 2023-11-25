import { AuthGuard, Authentication } from "@/api/authentication"
import { IfLoggedIn, IfNotLoggedIn } from "@/component/authentication"
import { Header } from "../(index)/layout"
import { Navigation } from "@/lib/error"

export default async function IndexLayout({ children }: any) {

  // Do not put this here or /passwordless wont work!
  // await AuthGuard.guestOnly()
  const user = await Authentication.getSession()

  return <>
    <Header>
      <section className="w-full">
        <form>
          <button formAction={ async function () {
            "use server"
            await Authentication.logout()
            Navigation.redirectTo('/')
          } }>{ '<- Back' }</button>
        </form>
      </section>
    </Header>
    <Main>
      <header>
        <p>🔒</p>
      </header>
      { children }
    </Main>
  </>
}
function Main({ children }: any) {
  return <main className="
    max-w-md w-full mx-auto
    px-10 pb-24
    break-words
    my-auto

    [&>header]:mb-4
    [&>header]:text-base
    [&>header>p]:text-white
    [&>header>p]:text-center
    [&_p]:text-center
    [&_h1]:text-center
  ">
    { children }
  </main>
}