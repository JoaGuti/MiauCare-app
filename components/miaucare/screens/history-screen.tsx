"use client"

import { motion } from "framer-motion"
import { User, Clock, CalendarHeart } from "lucide-react"
import { useAppStore } from "@/lib/store"

function formatTimeAgo(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "hace tiempo"
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

  // Safely compute max tasks to avoid division by zero or NaN
  const maxTasks = Math.max(1, ...caregiverStats.map((s) => s.tasksThisWeek))

  return (
    <motion.div
      className="flex flex-col gap-6 p-4 pb-28"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="text-2xl font-bold text-gray-800">Historial</h1>

      {/* Caregiver Comparison */}
      <div className="bg-white rounded-[2rem] p-5 shadow-md border border-gray-100/50">
        <h2 className="font-bold text-gray-700 text-sm mb-4 uppercase tracking-wider pl-1">
          Actividad esta Semana
        </h2>
        {caregiverStats.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No hay estadísticas de cuidadores disponibles.</p>
        ) : (
          <div className="space-y-4">
            {caregiverStats.map((stat, index) => (
              <div key={stat.caregiver} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index % 2 === 0 ? "bg-peach-100" : "bg-mint-100"
                      }`}
                    >
                      <User
                        className={`w-4 h-4 ${
                          index % 2 === 0 ? "text-peach-600" : "text-mint-600"
                        }`}
                      />
                    </div>
                    <span className="font-semibold text-sm text-gray-700">{stat.caregiver}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    {stat.tasksThisWeek} {stat.tasksThisWeek === 1 ? "tarea" : "tareas"}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      index % 2 === 0
                        ? "bg-gradient-to-r from-peach-400 to-peach-500"
                        : "bg-gradient-to-r from-mint-400 to-mint-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.tasksThisWeek / maxTasks) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.15 }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-[2rem] p-5 shadow-md border border-gray-100/50">
        <h2 className="font-bold text-gray-700 text-sm mb-4 uppercase tracking-wider pl-1">
          Actividad Reciente
        </h2>
        
        {activityLog.length === 0 ? (
          <div className="text-center py-8 space-y-2 text-gray-400">
            <CalendarHeart className="w-8 h-8 mx-auto stroke-1" />
            <p className="text-xs">Aún no se han registrado actividades para este gatito.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activityLog.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                className="flex items-start gap-3 py-3.5 border-b border-gray-100 last:border-0"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    index % 2 === 0 ? "bg-peach-100" : "bg-mint-100"
                  }`}
                >
                  <User
                    className={`w-4.5 h-4.5 ${
                      index % 2 === 0
                        ? "text-peach-600"
                        : "text-mint-600"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 leading-normal">
                    <span className="font-bold text-gray-900">{activity.caregiver}</span>{" "}
                    <span className="text-gray-600">{activity.action}</span>
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-medium">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
