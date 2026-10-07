function LoadingState() {
  return (
    <div className="status-panel" role="status">
      <span className="spinner" aria-hidden="true" />
      <div>
        <strong>Loading Pokémon</strong>
        <p>Gathering details from the PokéAPI…</p>
      </div>
    </div>
  )
}

export default LoadingState
