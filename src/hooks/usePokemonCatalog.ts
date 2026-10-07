import { useCallback, useEffect, useState } from 'react'
import { getPokemonCatalog } from '../api/pokemon'
import type { PokemonCatalogItem } from '../types/pokemon'
import { getErrorMessage } from '../utils/format'

export function usePokemonCatalog() {
  const [pokemon, setPokemon] = useState<PokemonCatalogItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestVersion, setRequestVersion] = useState(0)

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1)
  }, [])

  useEffect(() => {
    let isActive = true

    async function loadCatalog() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getPokemonCatalog(requestVersion > 0)
        if (isActive) setPokemon(data)
      } catch (requestError) {
        if (isActive) setError(getErrorMessage(requestError))
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadCatalog()

    return () => {
      isActive = false
    }
  }, [requestVersion])

  return { pokemon, isLoading, error, retry }
}
