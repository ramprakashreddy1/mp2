import { formatName } from '../utils/format'

interface TypeBadgeProps {
  type: string
}

function TypeBadge({ type }: TypeBadgeProps) {
  return <span className={`type-badge type-${type}`}>{formatName(type)}</span>
}

export default TypeBadge
