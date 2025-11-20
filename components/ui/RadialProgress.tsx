"use client"
import { useEffect, useState } from 'react'

interface RadialProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  showPercentage?: boolean
  animate?: boolean
  duration?: number
  progressColor?: string
  backgroundColor?: string
  textColor?: string
}

export function RadialProgress({
  value,
  size = 48,
  strokeWidth = 4,
  className = '',
  showPercentage = true,
  animate = true,
  duration = 800,
  progressColor = 'rgb(16, 185, 129)',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  textColor = 'white',
}: RadialProgressProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value)
  
  useEffect(() => {
    if (!animate) {
      setDisplayValue(value)
      return
    }

    let startValue = 0
    const increment = value / (duration / 16)
    
    const timer = setInterval(() => {
      startValue += increment
      if (startValue >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(startValue))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [value, animate, duration])

  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (displayValue / 100) * circumference
  
  // Dynamic font size based on container size
  const fontSize = size * 0.3 // 30% of container size

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: animate ? 'stroke-dashoffset 0.3s ease' : 'none'
          }}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="font-bold" 
            style={{ 
              color: textColor,
              fontSize: `${fontSize}px`
            }}
          >
            {displayValue}%
          </span>
        </div>
      )}
    </div>
  )
}
