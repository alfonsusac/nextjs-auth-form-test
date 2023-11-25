export default function Layout(p: {
  children: React.ReactNode
}) {
  return <section className="max-w-xs mx-auto">
    <a href="/settings">{ '<- Back' }</a>
    { p.children }
  </section>
}