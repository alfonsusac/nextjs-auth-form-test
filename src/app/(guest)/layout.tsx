import { Authentication } from "@/api/authentication"
import { IfLoggedIn, IfNotLoggedIn } from "@/component/authentication"
import { Header } from "../(index)/layout"
import { Navigation } from "@/lib/error"

export default async function IndexLayout({ children }: any) {

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
    max-w-screen-lg w-full mx-auto
    px-10 pb-24
    break-words
    my-auto
    max-w-sm
    [&>header]:mb-4
    [&>header]:text-base
    [&>header>p]:text-white
    [&>header>p]:text-center
    [&>h2]:text-center
    [&>h2]:leading-loose
    [&>p]:text-center
  ">
    { children }
  </main>
}