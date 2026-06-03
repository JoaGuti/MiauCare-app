"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BottomNav } from "./bottom-nav"
import { PetScreen } from "./screens/pet-screen"
import { HealthScreen } from "./screens/health-screen"
import { HistoryScreen } from "./screens/history-screen"
import { SettingsScreen } from "./screens/settings-screen"
import { useAppStore } from "@/lib/store"

export function MiauCareApp() {
  const [activeTab, setActiveTab] = useState("mascota")
  const { catNeeds, decreaseNeeds } = useAppStore()

  // Simulate needs decreasing over time
  useEffect(() => {
    const interval = setInterval(() => {
      decreaseNeeds()
    }, 3000) // Every 3 seconds

    return () => clearInterval(interval)
  }, [decreaseNeeds])

  // Calculate if critical state
  const averageNeeds = (catNeeds.hunger + catNeeds.hygiene + catNeeds.fun) / 3
  const isCritical = averageNeeds < 30

  const renderScreen = () => {
    switch (activeTab) {
      case "mascota":
        return <PetScreen />
      case "salud":
        return <HealthScreen />
      case "historial":
        return <HistoryScreen />
      case "ajustes":
        return <SettingsScreen />
      default:
        return <PetScreen />
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isCritical ? "bg-red-50" : "bg-cream-50"
      }`}
    >
      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
