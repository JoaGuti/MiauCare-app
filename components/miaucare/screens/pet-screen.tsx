"use client"

import { motion } from "framer-motion"
import { CatAvatar } from "../cat-avatar"
import { NeedsBar } from "../needs-bar"
import { StreakCounter } from "../streak-counter"
import { CaregiverToggle } from "../caregiver-toggle"
import { CareActions } from "../care-actions"
import { useAppStore } from "@/lib/store"
import type { CatMood } from "@/lib/types"

export function PetScreen() {
  const {
    currentCaregiver,
    setCaregiver,
    catNeeds,
    streak,
    feed,
    clean,
    giveSnack,
    play,
  } = useAppStore()

  const averageNeeds = (catNeeds.hunger + catNeeds.hygiene + catNeeds.fun) / 3
  const isCritical = averageNeeds < 30
  
  const getMood = (): CatMood => {
    if (averageNeeds < 30) return "sad"
    if (averageNeeds < 50) return "sleeping"
    return "happy"
  }

  return (
    <motion.div
      className="flex flex-col gap-6 p-4 pb-28"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">MiauCare</h1>
          <p className="text-sm text-gray-500">Cuidando juntos a Gatito</p>
        </div>
        <StreakCounter streak={streak} />
      </div>

      {/* Caregiver Toggle */}
      <div className="flex justify-center">
        <CaregiverToggle current={currentCaregiver} onChange={setCaregiver} />
      </div>

      {/* Cat Avatar */}
      <div className="flex justify-center py-4">
        <CatAvatar mood={getMood()} isCritical={isCritical} />
      </div>

      {/* Needs Bars */}
      <div className="bg-white rounded-3xl p-4 shadow-lg space-y-4">
        <h2 className="font-semibold text-gray-700 mb-2">Necesidades</h2>
        <NeedsBar type="hunger" value={catNeeds.hunger} />
        <NeedsBar type="hygiene" value={catNeeds.hygiene} />
        <NeedsBar type="fun" value={catNeeds.fun} />
      </div>

      {/* Care Actions */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-3">Acciones de Cuidado</h2>
        <CareActions onFeed={feed} onClean={clean} onSnack={giveSnack} onPlay={play} />
      </div>
    </motion.div>
  )
}
