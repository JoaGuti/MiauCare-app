"use client"

import { motion } from "framer-motion"
import { User } from "lucide-react"
import type { Caregiver } from "@/lib/types"

interface CaregiverToggleProps {
  current: Caregiver
  onChange: (caregiver: Caregiver) => void
}

export function CaregiverToggle({ current, onChange }: CaregiverToggleProps) {
  const isFirst = current === "Cuidador 1"

  return (
    <div className="relative flex bg-cream-100 rounded-full p-1">
      <motion.div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-md"
        animate={{ x: isFirst ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <button
        onClick={() => onChange("Cuidador 1")}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          isFirst ? "text-peach-600" : "text-gray-400"
        }`}
      >
        <User className="w-4 h-4" />
        <span>Cuidador 1</span>
      </button>
      <button
        onClick={() => onChange("Cuidador 2")}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !isFirst ? "text-peach-600" : "text-gray-400"
        }`}
      >
        <User className="w-4 h-4" />
        <span>Cuidador 2</span>
      </button>
    </div>
  )
}
