"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for doorbell rings
const dailyData = [
  { time: "12 AM", rings: 0 },
  { time: "2 AM", rings: 0 },
  { time: "4 AM", rings: 0 },
  { time: "6 AM", rings: 1 },
  { time: "8 AM", rings: 3 },
  { time: "10 AM", rings: 2 },
  { time: "12 PM", rings: 4 },
  { time: "2 PM", rings: 2 },
  { time: "4 PM", rings: 3 },
  { time: "6 PM", rings: 5 },
  { time: "8 PM", rings: 2 },
  { time: "10 PM", rings: 1 },
]

const weeklyData = [
  { day: "Mon", rings: 12 },
  { day: "Tue", rings: 15 },
  { day: "Wed", rings: 10 },
  { day: "Thu", rings: 18 },
  { day: "Fri", rings: 14 },
  { day: "Sat", rings: 22 },
  { day: "Sun", rings: 16 },
]

const monthlyData = [
  { week: "Week 1", rings: 85 },
  { week: "Week 2", rings: 72 },
  { week: "Week 3", rings: 90 },
  { week: "Week 4", rings: 78 },
]

export default function RingFrequencyChart({ period = "daily" }) {
  const getData = () => {
    switch (period) {
      case "daily":
        return dailyData
      case "weekly":
        return weeklyData
      case "monthly":
        return monthlyData
      default:
        return dailyData
    }
  }

  const getDataKey = () => {
    switch (period) {
      case "daily":
        return "time"
      case "weekly":
        return "day"
      case "monthly":
        return "week"
      default:
        return "time"
    }
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={getData()}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={getDataKey()} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="rings"
            stroke="#0ea5e9"
            fill="#0ea5e9"
            fillOpacity={0.3}
            name="Doorbell Rings"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
