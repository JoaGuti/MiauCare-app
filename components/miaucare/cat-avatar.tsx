"use client"

import { motion } from "framer-motion"
import type { CatMood } from "@/lib/types"

interface CatAvatarProps {
  mood: CatMood
  isCritical: boolean
}

const catExpressions = {
  happy: "( ^.^ )",
  sad: "( ;_; )",
  sleeping: "( -.- )zzZ",
}

const catEmojis = {
  happy: "😺",
  sad: "😿",
  sleeping: "😴",
}

export function CatAvatar({ mood, isCritical }: CatAvatarProps) {
  return (
    <motion.div
      className={`relative w-48 h-48 rounded-[3rem] flex items-center justify-center shadow-xl ${
        isCritical
          ? "bg-gradient-to-br from-red-100 to-red-200"
          : "bg-gradient-to-br from-peach-100 to-cream-100"
      }`}
      animate={{
        scale: mood === "happy" ? [1, 1.02, 1] : 1,
        rotate: mood === "sleeping" ? [-2, 2, -2] : 0,
      }}
      transition={{
        duration: mood === "happy" ? 2 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute -top-3 -left-3 w-12 h-12 bg-cream-200 rounded-full"
        style={{ borderRadius: "50% 50% 50% 0" }}
      />
      <motion.div
        className="absolute -top-3 -right-3 w-12 h-12 bg-cream-200 rounded-full"
        style={{ borderRadius: "50% 50% 0 50%" }}
      />
      
      <div className="text-center">
        <motion.span
          className="text-7xl block mb-2"
          animate={{
            y: mood === "sleeping" ? [0, -5, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {catEmojis[mood]}
        </motion.span>
        <span className="text-sm font-mono text-gray-500">
          {catExpressions[mood]}
        </span>
      </div>

      {isCritical && (
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          Necesita atención
        </motion.div>
      )}
    </motion.div>
  )
}
