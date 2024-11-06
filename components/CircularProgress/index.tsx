interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  textSize?: string
}

export default function CircularProgress({
  value,
  size = 56,
  strokeWidth = 3,
  className = "",
  textSize = ""
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          className="text-muted-foreground/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-lime-500 transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center ${textSize}`}>
        {value.toFixed(2)}%
      </div>
    </div>
  )
}