"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for motion detection
const dailyData = [
  { time: "12 AM", motions: 2 },
  { time: "2 AM", motions: 1 },
  { time: "4 AM", motions: 0 },
  { time: "6 AM", motions: 5 },
  { time: "8 AM", motions: 12 },
  { time: "10 AM", motions: 8 },
  { time: "12 PM", motions: 10 },
  { time: "2 PM", motions: 7 },
  { time: "4 PM", motions: 9 },
  { time: "6 PM", motions: 15 },
  { time: "8 PM", motions: 11 },
  { time: "10 PM", motions: 6 },
]

const weeklyData = [
  { day: "Mon", motions: 45 },
  { day: "Tue", motions: 52 },
  { day: "Wed", motions: 48 },
  { day: "Thu", motions: 61 },
  { day: "Fri", motions: 55 },
  { day: "Sat", motions: 78 },
  { day: "Sun", motions: 70 },
]

const monthlyData = [
  { week: "Week 1", motions: 320 },
  { week: "Week 2", motions: 280 },
  { week: "Week 3", motions: 310 },
  { week: "Week 4", motions: 350 },
]

export default function MotionChart({ period = "daily" }) {
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
        <LineChart
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
          <Line type="monotone" dataKey="motions" stroke="#ef4444" activeDot={{ r: 8 }} name="Motion Events" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 