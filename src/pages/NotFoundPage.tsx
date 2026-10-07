import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="empty-state not-found" aria-labelledby="not-found-heading">
      <p className="eyebrow">404</p>
      <h1 id="not-found-heading">Page not found</h1>
      <p>This route seems to have fled into the tall grass.</p>
      <Link className="text-link" to="/">
        Return to the Pokédex
      </Link>
    </section>
  )
}

export default NotFoundPage
