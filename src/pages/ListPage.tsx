import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import TypeBadge from '../components/TypeBadge'
import { usePokemonCatalog } from '../hooks/usePokemonCatalog'
import {
  formatHeight,
  formatName,
  formatPokemonNumber,
  formatWeight,
} from '../utils/format'

type SortField = 'id' | 'name' | 'height' | 'weight'
type SortDirection = 'ascending' | 'descending'

function ListPage() {
  const { pokemon, isLoading, error, retry } = usePokemonCatalog()
  const [query, setQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('id')
  const [sortDirection, setSortDirection] =
    useState<SortDirection>('ascending')

  const visiblePokemon = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase().replace(/^#/, '')
    const filtered = pokemon.filter(
      (item) =>
        item.name.includes(normalizedQuery) ||
        item.id.toString().includes(normalizedQuery),
    )

    return [...filtered].sort((first, second) => {
      const firstValue = first[sortField]
      const secondValue = second[sortField]
      const comparison =
        typeof firstValue === 'string'
          ? firstValue.localeCompare(String(secondValue))
          : firstValue - Number(secondValue)

      return sortDirection === 'ascending' ? comparison : -comparison
    })
  }, [pokemon, query, sortDirection, sortField])

  function toggleSortDirection() {
    setSortDirection((direction) =>
      direction === 'ascending' ? 'descending' : 'ascending',
    )
  }

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Pokémon database</p>
          <h1>Find your Pokémon</h1>
          <p>Search, compare, and explore the original 151.</p>
        </div>
        <span className="result-count">
          {visiblePokemon.length} of {pokemon.length || 151}
        </span>
      </section>

      <section className="controls" aria-label="List controls">
        <label className="field field--search">
          <span>Search by name or number</span>
          <div className="search-input-wrap">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Pikachu or 25"
            />
          </div>
        </label>

        <label className="field">
          <span>Sort by</span>
          <select
            value={sortField}
            onChange={(event) => setSortField(event.target.value as SortField)}
          >
            <option value="id">Pokédex number</option>
            <option value="name">Name</option>
            <option value="height">Height</option>
            <option value="weight">Weight</option>
          </select>
        </label>

        <button
          className="sort-button"
          type="button"
          onClick={toggleSortDirection}
          aria-label={`Sort ${sortDirection === 'ascending' ? 'descending' : 'ascending'}`}
        >
          <span aria-hidden="true">
            {sortDirection === 'ascending' ? '↑' : '↓'}
          </span>
          {sortDirection === 'ascending' ? 'Ascending' : 'Descending'}
        </button>
      </section>

      {isLoading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={retry} />}

      {!isLoading && !error && visiblePokemon.length === 0 && (
        <div className="empty-state">
          <span aria-hidden="true">?</span>
          <h2>No Pokémon found</h2>
          <p>Try a different name or Pokédex number.</p>
        </div>
      )}

      {!isLoading && !error && visiblePokemon.length > 0 && (
        <div className="pokemon-list" aria-label="Pokémon list">
          <div className="pokemon-list__labels" aria-hidden="true">
            <span>Pokémon</span>
            <span>Type</span>
            <span>Height</span>
            <span>Weight</span>
            <span />
          </div>
          {visiblePokemon.map((item) => (
            <Link
              className="pokemon-row"
              key={item.id}
              to={`/pokemon/${item.id}`}
            >
              <div className="pokemon-row__identity">
                <div className="pokemon-row__image-wrap">
                  {item.image && (
                    <img src={item.image} alt="" loading="lazy" />
                  )}
                </div>
                <div>
                  <span>{formatPokemonNumber(item.id)}</span>
                  <strong>{formatName(item.name)}</strong>
                </div>
              </div>
              <div className="type-list">
                {item.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
              <span className="pokemon-row__fact" data-label="Height">
                {formatHeight(item.height)}
              </span>
              <span className="pokemon-row__fact" data-label="Weight">
                {formatWeight(item.weight)}
              </span>
              <span className="row-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default ListPage
