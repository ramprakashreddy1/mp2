import { Link } from 'react-router-dom'
import type { PokemonCatalogItem } from '../types/pokemon'
import { formatName, formatPokemonNumber } from '../utils/format'
import TypeBadge from './TypeBadge'

interface PokemonCardProps {
  pokemon: PokemonCatalogItem
}

function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link className="pokemon-card" to={`/pokemon/${pokemon.id}`}>
      <span className="pokemon-card__number">
        {formatPokemonNumber(pokemon.id)}
      </span>
      <div className="pokemon-card__image-wrap">
        {pokemon.image ? (
          <img
            className="pokemon-card__image"
            src={pokemon.image}
            alt={formatName(pokemon.name)}
            loading="lazy"
          />
        ) : (
          <span className="image-fallback" aria-hidden="true">
            ?
          </span>
        )}
      </div>
      <h2>{formatName(pokemon.name)}</h2>
      <div className="type-list">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
    </Link>
  )
}

export default PokemonCard
