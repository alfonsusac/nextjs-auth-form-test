export default function Layout(p: {
  children: React.ReactNode
}) {
  return <>
    <a href="/settings">{ '<- Back' }</a>
    { p.children }
  </>
}