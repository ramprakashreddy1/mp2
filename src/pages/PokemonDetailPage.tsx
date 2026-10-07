import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPokemonDetails, POKEMON_LIMIT } from '../api/pokemon'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import TypeBadge from '../components/TypeBadge'
import type { PokemonDetails } from '../types/pokemon'
import {
  formatHeight,
  formatName,
  formatPokemonNumber,
  formatWeight,
  getErrorMessage,
} from '../utils/format'

function PokemonDetailPage() {
  const { pokemonId } = useParams()
  const id = Number(pokemonId)
  const [details, setDetails] = useState<PokemonDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    let isActive = true

    async function loadDetails() {
      if (!Number.isInteger(id) || id < 1 || id > POKEMON_LIMIT) {
        setError('That Pokédex number is outside the current collection.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)
      setDetails(null)

      try {
        const data = await getPokemonDetails(id)
        if (isActive) setDetails(data)
      } catch (requestError) {
        if (isActive) setError(getErrorMessage(requestError))
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadDetails()

    return () => {
      isActive = false
    }
  }, [id, requestVersion])

  const description = useMemo(() => {
    if (!details) return ''
    const englishEntries = details.species.flavor_text_entries.filter(
      (entry) => entry.language.name === 'en',
    )
    return englishEntries
      .at(-1)
      ?.flavor_text.replace(/[\n\f]/g, ' ')
      .replace(/\s+/g, ' ')
  }, [details])

  if (isLoading) return <LoadingState />

  if (error || !details) {
    return (
      <ErrorState
        message={error ?? 'This Pokémon could not be found.'}
        onRetry={() => setRequestVersion((version) => version + 1)}
      />
    )
  }

  const { pokemon, species } = details
  const image =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default
  const shinyImage =
    pokemon.sprites.other['official-artwork'].front_shiny ??
    pokemon.sprites.front_shiny
  const genus = species.genera.find((entry) => entry.language.name === 'en')

  return (
    <article className="detail-page">
      <div className="detail-toolbar">
        <Link className="back-link" to="/">
          ← Back to list
        </Link>

        <nav className="detail-navigation" aria-label="Pokémon navigation">
          {pokemon.id > 1 ? (
            <Link to={`/pokemon/${pokemon.id - 1}`}>
              <span>← Previous</span>
              <strong>{formatPokemonNumber(pokemon.id - 1)}</strong>
            </Link>
          ) : (
            <span className="detail-navigation__disabled">Start of Pokédex</span>
          )}
          {pokemon.id < POKEMON_LIMIT ? (
            <Link className="detail-navigation__next" to={`/pokemon/${pokemon.id + 1}`}>
              <span>Next →</span>
              <strong>{formatPokemonNumber(pokemon.id + 1)}</strong>
            </Link>
          ) : (
            <span className="detail-navigation__disabled">End of Pokédex</span>
          )}
        </nav>
      </div>

      <section className="detail-hero">
        <div className="detail-art">
          <span className="detail-art__number" aria-hidden="true">
            {pokemon.id.toString().padStart(3, '0')}
          </span>
          {image && <img src={image} alt={formatName(pokemon.name)} />}
        </div>

        <div className="detail-intro">
          <p className="eyebrow">{formatPokemonNumber(pokemon.id)}</p>
          <h1>{formatName(pokemon.name)}</h1>
          {genus && <p className="detail-genus">{genus.genus}</p>}
          <div className="type-list type-list--large">
            {pokemon.types.map(({ type }) => (
              <TypeBadge key={type.name} type={type.name} />
            ))}
          </div>
          <p className="detail-description">
            {description || 'No Pokédex description is available.'}
          </p>

          <dl className="quick-facts">
            <div>
              <dt>Height</dt>
              <dd>{formatHeight(pokemon.height)}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{formatWeight(pokemon.weight)}</dd>
            </div>
            <div>
              <dt>Base XP</dt>
              <dd>{pokemon.base_experience ?? '—'}</dd>
            </div>
            <div>
              <dt>Capture rate</dt>
              <dd>{species.capture_rate}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="detail-grid">
        <section className="detail-panel">
          <div className="section-title">
            <p className="eyebrow">Battle profile</p>
            <h2>Base stats</h2>
          </div>
          <div className="stat-list">
            {pokemon.stats.map(({ base_stat: value, stat }) => (
              <div className="stat-row" key={stat.name}>
                <span>{formatName(stat.name)}</span>
                <strong>{value}</strong>
                <progress value={value} max="255">
                  {value}
                </progress>
              </div>
            ))}
          </div>
        </section>

        <section className="detail-panel">
          <div className="section-title">
            <p className="eyebrow">Characteristics</p>
            <h2>Pokémon data</h2>
          </div>
          <dl className="data-list">
            <div>
              <dt>Abilities</dt>
              <dd>
                {pokemon.abilities.map(({ ability, is_hidden }) => (
                  <span key={ability.name}>
                    {formatName(ability.name)}{is_hidden ? ' (Hidden)' : ''}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Habitat</dt>
              <dd>{species.habitat ? formatName(species.habitat.name) : 'Unknown'}</dd>
            </div>
            <div>
              <dt>Growth rate</dt>
              <dd>{formatName(species.growth_rate.name)}</dd>
            </div>
            <div>
              <dt>Generation</dt>
              <dd>{formatName(species.generation.name)}</dd>
            </div>
            <div>
              <dt>Shape</dt>
              <dd>{species.shape ? formatName(species.shape.name) : 'Unknown'}</dd>
            </div>
            <div>
              <dt>Color</dt>
              <dd>{formatName(species.color.name)}</dd>
            </div>
            <div>
              <dt>Egg groups</dt>
              <dd>{species.egg_groups.map((group) => formatName(group.name)).join(', ')}</dd>
            </div>
            <div>
              <dt>Hatch cycles</dt>
              <dd>{species.hatch_counter}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="detail-panel detail-panel--wide">
        <div className="section-title section-title--split">
          <div>
            <p className="eyebrow">Move set</p>
            <h2>Featured moves</h2>
          </div>
          <span>{pokemon.moves.length} moves total</span>
        </div>
        <div className="chip-list">
          {pokemon.moves.slice(0, 20).map(({ move }) => (
            <span className="move-chip" key={move.name}>
              {formatName(move.name)}
            </span>
          ))}
        </div>
      </section>

      {shinyImage && (
        <section className="detail-panel detail-panel--wide variant-panel">
          <div className="shiny-preview">
            <img src={shinyImage} alt={`Shiny ${formatName(pokemon.name)}`} />
            <div>
              <p className="eyebrow">Rare variant</p>
              <h2>Shiny form</h2>
            </div>
          </div>
          <p className="variant-note">A rare alternate coloration.</p>
        </section>
      )}

    </article>
  )
}

export default PokemonDetailPage
