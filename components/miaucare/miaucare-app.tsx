"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"
import { BottomNav } from "./bottom-nav"
import { PetScreen } from "./screens/pet-screen"
import { HealthScreen } from "./screens/health-screen"
import { HistoryScreen } from "./screens/history-screen"
import { SettingsScreen } from "./screens/settings-screen"
import { LoginScreen } from "./screens/login-screen"
import { CatSelectorScreen } from "./screens/cat-selector-screen"
import { useAppStore } from "@/lib/store"
import { Cat } from "lucide-react"

export function MiauCareApp() {
  const { status } = useSession()
  const [activeTab, setActiveTab] = useState("mascota")
  const { activeCatId, catNeeds, decreaseNeeds } = useAppStore()

  // Simulate needs decreasing over time, only if a cat is selected and app is authenticated
  useEffect(() => {
    if (status !== "authenticated" || !activeCatId) return

    const interval = setInterval(() => {
      decreaseNeeds()
    }, 3000) // Every 3 seconds

    return () => clearInterval(interval)
  }, [decreaseNeeds, status, activeCatId])

  // Reset tab to "mascota" when cat changes
  useEffect(() => {
    setActiveTab("mascota")
  }, [activeCatId])

  // Calculate if critical state
  const averageNeeds = (catNeeds.hunger + catNeeds.hygiene + catNeeds.fun) / 3
  const isCritical = activeCatId ? averageNeeds < 30 : false

  // Handle Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-peach-200 border-t-peach-500"
        />
        <div className="flex items-center gap-2 text-peach-600 font-bold animate-pulse">
          <Cat className="w-5 h-5" />
          <span>Cargando MiauCare...</span>
        </div>
      </div>
    )
  }

  // Handle Unauthenticated state
  if (status === "unauthenticated") {
    return <LoginScreen />
  }

  // Handle No Cat Selected state
  if (!activeCatId) {
    return <CatSelectorScreen />
  }

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
      className={`min-h-screen transition-colors duration-500 pb-16 ${
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
