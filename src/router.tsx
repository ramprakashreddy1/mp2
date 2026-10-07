import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import GalleryPage from './pages/GalleryPage'
import ListPage from './pages/ListPage'
import NotFoundPage from './pages/NotFoundPage'
import PokemonDetailPage from './pages/PokemonDetailPage'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: <ListPage />,
        },
        {
          path: 'gallery',
          element: <GalleryPage />,
        },
        {
          path: 'pokemon/:pokemonId',
          element: <PokemonDetailPage />,
        },
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
)
