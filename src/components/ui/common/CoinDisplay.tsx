interface CoinDisplayProps {
  amount: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CoinDisplay({ amount, size = 'md', className = '' }: CoinDisplayProps) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-bold text-yellow-300 ${sizes[size]} ${className}`}
    >
      <span className="inline-block w-5 h-5 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 border border-yellow-200/50 shadow text-center text-xs leading-5 text-amber-800">
        $
      </span>
      <span>{amount.toLocaleString()}</span>
    </div>
  )
}
