export function formatName(value: string) {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatPokemonNumber(id: number) {
  return `#${id.toString().padStart(3, '0')}`
}

export function formatHeight(decimeters: number) {
  return `${(decimeters / 10).toFixed(1)} m`
}

export function formatWeight(hectograms: number) {
  return `${(hectograms / 10).toFixed(1)} kg`
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Something went wrong while loading Pokémon data.'
}
