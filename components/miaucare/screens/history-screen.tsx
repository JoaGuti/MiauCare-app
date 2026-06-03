"use client"

import { motion } from "framer-motion"
import { User, Clock } from "lucide-react"
import { useAppStore } from "@/lib/store"

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return "ahora mismo"
  if (minutes < 60) return `hace ${minutes} min`
  if (hours < 24) return `hace ${hours}h`
  return `hace ${days}d`
}

export function HistoryScreen() {
  const { activityLog, caregiverStats } = useAppStore()

  const maxTasks = Math.max(...caregiverStats.map((s) => s.tasksThisWeek))

  return (
    <motion.div
      className="flex flex-col gap-6 p-4 pb-28"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="text-2xl font-bold text-gray-800">Historial</h1>

      {/* Caregiver Comparison */}
      <div className="bg-white rounded-3xl p-4 shadow-lg">
        <h2 className="font-semibold text-gray-700 mb-4">Esta Semana</h2>
        <div className="space-y-4">
          {caregiverStats.map((stat, index) => (
            <div key={stat.caregiver} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? "bg-peach-100" : "bg-mint-100"
                    }`}
                  >
                    <User
                      className={`w-4 h-4 ${
                        index === 0 ? "text-peach-600" : "text-mint-600"
                      }`}
                    />
                  </div>
                  <span className="font-medium text-gray-700">{stat.caregiver}</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  {stat.tasksThisWeek} tareas
                </span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    index === 0
                      ? "bg-gradient-to-r from-peach-400 to-peach-500"
                      : "bg-gradient-to-r from-mint-400 to-mint-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.tasksThisWeek / maxTasks) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-3xl p-4 shadow-lg">
        <h2 className="font-semibold text-gray-700 mb-4">Actividad Reciente</h2>
        <div className="space-y-1">
          {activityLog.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.caregiver === "Cuidador 1" ? "bg-peach-100" : "bg-mint-100"
                }`}
              >
                <User
                  className={`w-5 h-5 ${
                    activity.caregiver === "Cuidador 1"
                      ? "text-peach-600"
                      : "text-mint-600"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{activity.caregiver}</span>{" "}
                  {activity.action}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
