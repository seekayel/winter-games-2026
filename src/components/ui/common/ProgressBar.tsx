interface ProgressBarProps {
  value: number
  max: number
  color?: string
  className?: string
  showLabel?: boolean
}

export function ProgressBar({
  value,
  max,
  color = 'bg-ice-400',
  className = '',
  showLabel = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={`relative h-3 bg-ice-900/50 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${color} rounded-full transition-all duration-300`}
        style={{ width: `${pct}%` }}
      />
      {showLabel && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
          {value}/{max}
        </span>
      )}
    </div>
  )
}
