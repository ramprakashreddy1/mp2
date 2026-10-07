import { useMemo, useState } from 'react'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import PokemonCard from '../components/PokemonCard'
import { usePokemonCatalog } from '../hooks/usePokemonCatalog'
import { formatName } from '../utils/format'

function GalleryPage() {
  const { pokemon, isLoading, error, retry } = usePokemonCatalog()
  const [selectedType, setSelectedType] = useState('all')

  const types = useMemo(
    () =>
      [...new Set(pokemon.flatMap((item) => item.types))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [pokemon],
  )

  const visiblePokemon = useMemo(
    () =>
      selectedType === 'all'
        ? pokemon
        : pokemon.filter((item) => item.types.includes(selectedType)),
    [pokemon, selectedType],
  )

  return (
    <>
      <section className="page-heading page-heading--gallery">
        <div>
          <p className="eyebrow">Visual explorer</p>
          <h1>Pokémon gallery</h1>
          <p>Filter the collection by elemental type.</p>
        </div>
        <label className="field gallery-filter">
          <span>Filter by type</span>
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
          >
            <option value="all">All types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {formatName(type)}
              </option>
            ))}
          </select>
        </label>
      </section>

      {!isLoading && !error && (
        <p className="gallery-summary">
          Showing <strong>{visiblePokemon.length}</strong> Pokémon
          {selectedType !== 'all' && (
            <>
              {' '}
              with the <strong>{formatName(selectedType)}</strong> type
            </>
          )}
        </p>
      )}

      {isLoading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={retry} />}

      {!isLoading && !error && (
        <div className="pokemon-grid">
          {visiblePokemon.map((item) => (
            <PokemonCard key={item.id} pokemon={item} />
          ))}
        </div>
      )}
    </>
  )
}

export default GalleryPage
