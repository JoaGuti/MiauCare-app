"use client"

import { motion } from "framer-motion"
import { Utensils, Sparkles, Gamepad2 } from "lucide-react"

interface NeedsBarProps {
  type: "hunger" | "hygiene" | "fun"
  value: number
}

const config = {
  hunger: {
    icon: Utensils,
    label: "Hambre",
    colors: "from-peach-400 to-peach-500",
    bgColor: "bg-peach-100",
  },
  hygiene: {
    icon: Sparkles,
    label: "Higiene",
    colors: "from-mint-400 to-mint-500",
    bgColor: "bg-mint-100",
  },
  fun: {
    icon: Gamepad2,
    label: "Diversión",
    colors: "from-cream-400 to-peach-400",
    bgColor: "bg-cream-200",
  },
}

export function NeedsBar({ type, value }: NeedsBarProps) {
  const { icon: Icon, label, colors, bgColor } = config[type]
  const isLow = value < 30

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${bgColor}`}
      >
        <Icon className={`w-5 h-5 ${isLow ? "text-red-500" : "text-gray-600"}`} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span
            className={`text-xs font-semibold ${
              isLow ? "text-red-500" : "text-gray-500"
            }`}
          >
            {Math.round(value)}%
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${colors}`}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  )
}
