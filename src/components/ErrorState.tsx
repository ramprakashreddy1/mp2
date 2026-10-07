interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="status-panel status-panel--error" role="alert">
      <div>
        <strong>We couldn’t load the Pokémon.</strong>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button className="button button--secondary" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorState
