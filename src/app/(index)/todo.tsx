import { LoggedInUser } from "@/api/account"
import { Authentication } from "@/api/authentication"
import { Navigation } from "@/lib/error"
import prisma from "@/lib/singleton"
import { Prisma } from "@prisma/client"

export async function TodoList() {
  const user = await LoggedInUser.getUser()
  const todos = await prisma.post.findMany({
    where: { ownerUsername: user.username }
  })
  return <>
    <br /><br />
    <input name="content" className="inline w-60 mr-2" />
    <button formAction={ addTodoAction } type="submit">Add</button>

    

    {
      todos.length === 0 && <article><br />You are doing great! Keep it up!</article>
    }
    {
      todos.toReversed().map((i) => {
        return (
          <article key={ i.id } className="
          mt-4
          p-2
          flex gap-2
          ">
            <button formAction={ deleteTodoAction.bind(null, i.id) }>Done</button>
            <span>
              { i.content }<br />
              <span className="opacity-20">{ i.id }</span>
            </span>
          </article>
        )
      })
    }

    

  </>
}


async function addTodoAction(formData: FormData) {
  "use server"
  const session = await LoggedInUser.getUser()
  const content = formData.get("content") as string
  if(!content) return
  await prisma.post.create({
    data: {
      content,
      ownerUsername: session.username
    }
  })
  Navigation.redirectTo('/')
}

async function deleteTodoAction(id: string) {
  "use server"
  const session = await LoggedInUser.getUser()
  await prisma.post.delete({
    where: {
      ownerUsername: session.username,
      id
    }
  })
  Navigation.redirectTo('/')
}