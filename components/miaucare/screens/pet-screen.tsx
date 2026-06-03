"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Users, Heart } from "lucide-react"
import { CatAvatar } from "../cat-avatar"
import { NeedsBar } from "../needs-bar"
import { StreakCounter } from "../streak-counter"
import { CareActions } from "../care-actions"
import { useAppStore } from "@/lib/store"
import type { CatMood } from "@/lib/types"

export function PetScreen() {
  const { data: session } = useSession()
  const {
    activeCat,
    catNeeds,
    streak,
    feed,
    clean,
    giveSnack,
    play,
  } = useAppStore()

  if (!activeCat) return null

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
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">MiauCare</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Cuidando juntos a <span className="text-peach-500 font-bold">{activeCat.name}</span>
          </p>
        </div>
        <StreakCounter streak={streak} />
      </div>

      {/* Caregiver list display */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-3 shadow-md border border-gray-100/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-peach-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-peach-500" />
          </div>
          <span className="text-xs font-semibold text-gray-600">Equipo de Cuidado:</span>
        </div>
        
        {/* Caregiver Avatar Stack */}
        <div className="flex -space-x-2">
          {activeCat.caregivers.map((cg) => (
            <div 
              key={cg.id} 
              title={cg.name}
              className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-cream-100 flex items-center justify-center shadow-sm relative group cursor-pointer"
            >
              {cg.image ? (
                <img src={cg.image} alt={cg.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold text-peach-600">{cg.name.charAt(0)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cat Avatar */}
      <div className="flex justify-center py-2">
        <CatAvatar mood={getMood()} isCritical={isCritical} />
      </div>

      {/* Needs Bars */}
      <div className="bg-white rounded-[2rem] p-5 shadow-lg space-y-4 border border-gray-100/50">
        <h2 className="font-bold text-gray-700 text-sm mb-1 uppercase tracking-wider pl-1">
          Necesidades básicas
        </h2>
        <NeedsBar type="hunger" value={catNeeds.hunger} />
        <NeedsBar type="hygiene" value={catNeeds.hygiene} />
        <NeedsBar type="fun" value={catNeeds.fun} />
      </div>

      {/* Care Actions */}
      <div>
        <h2 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wider pl-1">
          Acciones de Cuidado
        </h2>
        <CareActions onFeed={feed} onClean={clean} onSnack={giveSnack} onPlay={play} />
      </div>
    </motion.div>
  )
}
