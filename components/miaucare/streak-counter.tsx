"use client"

import { motion } from "framer-motion"
import { Flame } from "lucide-react"

interface StreakCounterProps {
  streak: number
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <motion.div
      className="flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-peach-100 px-3 py-1.5 rounded-full"
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        <Flame className="w-5 h-5 text-orange-500" />
      </motion.div>
      <span className="font-bold text-orange-600">{streak}</span>
      <span className="text-xs text-orange-500">días</span>
    </motion.div>
  )
}
