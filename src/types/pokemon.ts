export interface NamedApiResource {
  name: string
  url: string
}

export interface PokemonListResponse {
  results: NamedApiResource[]
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: NamedApiResource
}

export interface PokemonDetail {
  id: number
  name: string
  order: number
  height: number
  weight: number
  base_experience: number | null
  abilities: Array<{
    ability: NamedApiResource
    is_hidden: boolean
    slot: number
  }>
  cries: {
    latest: string | null
    legacy: string | null
  }
  game_indices: Array<{
    game_index: number
    version: NamedApiResource
  }>
  held_items: Array<{
    item: NamedApiResource
  }>
  moves: Array<{
    move: NamedApiResource
  }>
  species: NamedApiResource
  sprites: {
    front_default: string | null
    front_shiny: string | null
    other: {
      'official-artwork': {
        front_default: string | null
        front_shiny: string | null
      }
    }
  }
  stats: PokemonStat[]
  types: Array<{
    slot: number
    type: NamedApiResource
  }>
}

export interface PokemonSpecies {
  base_happiness: number | null
  capture_rate: number
  color: NamedApiResource
  egg_groups: NamedApiResource[]
  evolves_from_species: NamedApiResource | null
  flavor_text_entries: Array<{
    flavor_text: string
    language: NamedApiResource
    version: NamedApiResource
  }>
  gender_rate: number
  genera: Array<{
    genus: string
    language: NamedApiResource
  }>
  generation: NamedApiResource
  growth_rate: NamedApiResource
  habitat: NamedApiResource | null
  hatch_counter: number
  shape: NamedApiResource | null
}

export interface PokemonCatalogItem {
  id: number
  name: string
  height: number
  weight: number
  baseExperience: number | null
  image: string | null
  types: string[]
}

export interface PokemonDetails {
  pokemon: PokemonDetail
  species: PokemonSpecies
}
