"use client"

import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"

export { ResponsiveContainer, XAxis, YAxis }

export const BarChart = ({ data = [], index = "name", categories = [], colors = [], valueFormatter, ...props }) => (
  <ResponsiveContainer width="100%" height={350}>
    <RechartsBarChart data={data} {...props}>
      <XAxis dataKey={index} />
      <YAxis />
      {Array.isArray(categories) &&
        categories.map((category, i) => (
          <Bar key={category} dataKey={category} fill={colors[i] || `hsl(${i * 50}, 70%, 50%)`} />
        ))}
    </RechartsBarChart>
  </ResponsiveContainer>
)

export const LineChart = ({ data = [], index = "name", categories = [], colors = [], valueFormatter, ...props }) => (
  <ResponsiveContainer width="100%" height={350}>
    <RechartsLineChart data={data} {...props}>
      <XAxis dataKey={index} />
      <YAxis />
      {Array.isArray(categories) &&
        categories.map((category, i) => (
          <Line key={category} type="monotone" dataKey={category} stroke={colors[i] || `hsl(${i * 50}, 70%, 50%)`} />
        ))}
    </RechartsLineChart>
  </ResponsiveContainer>
)

export const PieChart = ({ data = [], category = "value", index = "name", colors = [], ...props }) => (
  <ResponsiveContainer width="100%" height={350}>
    <RechartsPieChart {...props}>
      <Pie
        data={data}
        dataKey={category}
        nameKey={index}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
        {...(Array.isArray(colors) && colors.length > 0 ? { fill: colors[0] } : {})}
      />
    </RechartsPieChart>
  </ResponsiveContainer>
)

export const RadarChart = ({ data = [], categories = [], index = "name", colors = [], ...props }) => (
  <ResponsiveContainer width="100%" height={350}>
    <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data} {...props}>
      <PolarGrid />
      <PolarAngleAxis dataKey={index} />
      <PolarRadiusAxis />
      {Array.isArray(categories) &&
        categories.map((category, i) => (
          <Radar
            key={category}
            name={category}
            dataKey={category}
            stroke={colors[i] || `hsl(${i * 50}, 70%, 50%)`}
            fill={colors[i] || `hsl(${i * 50}, 70%, 50%)`}
            fillOpacity={0.6}
          />
        ))}
    </RechartsRadarChart>
  </ResponsiveContainer>
)

