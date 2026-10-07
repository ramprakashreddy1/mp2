import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://pokeapi.co/api/v2',
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
})
