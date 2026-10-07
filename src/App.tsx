import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <NavLink className="brand" to="/">
            <span className="pokeball" aria-hidden="true" />
            <span className="brand-copy">
              <strong>Pokédex</strong>
              <small>Pokémon Explorer</small>
            </span>
          </NavLink>

          <nav className="main-nav" aria-label="Main navigation">
            <NavLink to="/" end>
              List
            </NavLink>
            <NavLink to="/gallery">Gallery</NavLink>
          </nav>
        </div>
      </header>

      <main className="page-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div>
          <span className="footer-ball" aria-hidden="true" />
          <p>
            Pokédex · Data provided by{' '}
            <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">
              PokéAPI
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
