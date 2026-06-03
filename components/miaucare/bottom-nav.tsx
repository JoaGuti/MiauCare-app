"use client"

import { motion } from "framer-motion"
import { Cat, Heart, Clock, Settings } from "lucide-react"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "mascota", label: "Mascota", icon: Cat },
  { id: "salud", label: "Salud", icon: Heart },
  { id: "historial", label: "Historial", icon: Clock },
  { id: "ajustes", label: "Ajustes", icon: Settings },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream-50 border-t border-cream-200 px-2 pb-6 pt-2 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors ${
                isActive ? "bg-peach-100 text-peach-600" : "text-gray-400"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-peach-500 rounded-full"
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
