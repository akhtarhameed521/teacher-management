"use client"

interface GpaCircleProps {
  value: number
}

export function GpaCircle({ value }: GpaCircleProps) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const progress = (value / 100) * circumference

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90">
        <circle className="text-muted stroke-current" strokeWidth="8" fill="transparent" r={radius} cx="64" cy="64" />
        <circle
          className="text-primary stroke-current"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="64"
          cy="64"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{value}</span>
      </div>
    </div>
  )
}

