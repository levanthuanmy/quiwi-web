import React, { FC } from 'react'
import styles from './Pie.module.css'
const cleanPercentage = (percentage: number) => {
  const tooLow = !Number.isFinite(+percentage) || percentage < 0
  const tooHigh = percentage > 100
  return tooLow ? 0 : tooHigh ? 100 : +percentage
}

const Circle: FC<{
  colour: string
  pct: number
}> = ({ colour, pct }) => {
  const r = 48
  const circ = 2 * Math.PI * r
  const strokePct = ((100 - pct) * circ) / 100
  return (
    <circle
      className={styles.circle}
      r={r}
      cx={132}
      cy={64}
      fill="transparent"
      stroke={strokePct !== circ ? colour : ''} // remove colour as 0% sets full circumference
      strokeWidth={'1em'}
      strokeDasharray={circ}
      strokeDashoffset={pct ? strokePct : 0}
      strokeLinecap="round"
    ></circle>
  )
}

const Text: FC<{
  percentage: number
}> = ({ percentage }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={'1.5em'}
    >
      {percentage.toFixed(0)}%
    </text>
  )
}

const Pie: FC<{
  percentage: number
  colour: string
}> = ({ percentage, colour }) => {
  const pct = cleanPercentage(percentage)
  return (
    <svg width={128} height={128}>
      <g transform={`rotate(-90 ${'100 100'})`}>
        <Circle colour="lightgrey" pct={100} />
        <Circle colour={colour} pct={pct} />
      </g>
      <Text percentage={pct} />
    </svg>
  )
}

export default Pie
