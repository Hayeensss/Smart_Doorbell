"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for mode usage
const dailyData = [
  { name: "Mon", home: 14, away: 8, dnd: 2 },
  { name: "Tue", home: 12, away: 10, dnd: 2 },
  { name: "Wed", home: 10, away: 12, dnd: 2 },
  { name: "Thu", home: 8, away: 14, dnd: 2 },
  { name: "Fri", home: 6, away: 16, dnd: 2 },
  { name: "Sat", home: 18, away: 4, dnd: 2 },
  { name: "Sun", home: 20, away: 2, dnd: 2 },
]

const weeklyData = [
  { name: "Week 1", home: 80, away: 60, dnd: 12 },
  { name: "Week 2", home: 75, away: 65, dnd: 14 },
  { name: "Week 3", home: 70, away: 70, dnd: 10 },
  { name: "Week 4", home: 85, away: 55, dnd: 8 },
]

const monthlyData = [
  { name: "Jan", home: 320, away: 240, dnd: 40 },
  { name: "Feb", home: 300, away: 260, dnd: 36 },
  { name: "Mar", home: 340, away: 220, dnd: 32 },
  { name: "Apr", home: 280, away: 280, dnd: 28 },
  { name: "May", home: 250, away: 310, dnd: 30 },
  { name: "Jun", home: 350, away: 210, dnd: 24 },
]

export default function ModeUsageChart({ period = "daily" }) {
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

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={getData()}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="home" fill="#3b82f6" name="Home" />
          <Bar dataKey="away" fill="#f97316" name="Away" />
          <Bar dataKey="dnd" fill="#8b5cf6" name="DND" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 