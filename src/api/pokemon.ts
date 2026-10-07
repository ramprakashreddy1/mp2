import { apiClient } from './client'
import type {
  PokemonCatalogItem,
  PokemonDetail,
  PokemonDetails,
  PokemonListResponse,
  PokemonSpecies,
} from '../types/pokemon'

export const POKEMON_LIMIT = 151

const CATALOG_CACHE_KEY = 'pokedex-catalog-v1'
const CACHE_DURATION = 24 * 60 * 60 * 1000
const BATCH_SIZE = 16

let catalogRequest: Promise<PokemonCatalogItem[]> | null = null

function toCatalogItem(pokemon: PokemonDetail): PokemonCatalogItem {
  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    baseExperience: pokemon.base_experience,
    image:
      pokemon.sprites.other['official-artwork'].front_default ??
      pokemon.sprites.front_default,
    types: pokemon.types
      .sort((a, b) => a.slot - b.slot)
      .map(({ type }) => type.name),
  }
}

function readCachedCatalog() {
  try {
    const value = localStorage.getItem(CATALOG_CACHE_KEY)
    if (!value) return null

    const cached = JSON.parse(value) as {
      timestamp: number
      data: PokemonCatalogItem[]
    }

    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CATALOG_CACHE_KEY)
      return null
    }

    return cached.data
  } catch {
    return null
  }
}

function cacheCatalog(data: PokemonCatalogItem[]) {
  try {
    localStorage.setItem(
      CATALOG_CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data }),
    )
  } catch {
    // The app still works when browser storage is unavailable or full.
  }
}

function clearCachedCatalog() {
  try {
    localStorage.removeItem(CATALOG_CACHE_KEY)
  } catch {
    // Storage can be unavailable in privacy-restricted browsing contexts.
  }
}

async function requestCatalog() {
  const { data } = await apiClient.get<PokemonListResponse>('/pokemon', {
    params: { limit: POKEMON_LIMIT, offset: 0 },
  })

  const catalog: PokemonCatalogItem[] = []

  for (let index = 0; index < data.results.length; index += BATCH_SIZE) {
    const batch = data.results.slice(index, index + BATCH_SIZE)
    const responses = await Promise.all(
      batch.map(({ name }) => apiClient.get<PokemonDetail>(`/pokemon/${name}`)),
    )
    catalog.push(...responses.map(({ data: pokemon }) => toCatalogItem(pokemon)))
  }

  const sortedCatalog = catalog.sort((a, b) => a.id - b.id)
  cacheCatalog(sortedCatalog)
  return sortedCatalog
}

export function getPokemonCatalog(forceRefresh = false) {
  if (forceRefresh) {
    clearCachedCatalog()
    catalogRequest = null
  }

  const cached = readCachedCatalog()
  if (cached) return Promise.resolve(cached)

  catalogRequest ??= requestCatalog().catch((error: unknown) => {
    catalogRequest = null
    throw error
  })

  return catalogRequest
}

export async function getPokemonDetails(id: number): Promise<PokemonDetails> {
  const { data: pokemon } = await apiClient.get<PokemonDetail>(`/pokemon/${id}`)
  const { data: species } = await apiClient.get<PokemonSpecies>(
    `/pokemon-species/${pokemon.species.name}`,
  )

  return { pokemon, species }
}
