"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Utensils, Trash2, Cookie, Gamepad2 } from "lucide-react"

interface CareActionsProps {
  onFeed: () => void
  onClean: () => void
  onSnack: () => void
  onPlay: () => void
}

const actions = [
  {
    id: "feed",
    label: "Dar de comer",
    icon: Utensils,
    bgColor: "bg-peach-100",
    hoverColor: "hover:bg-peach-200",
    iconColor: "text-peach-600",
  },
  {
    id: "clean",
    label: "Limpiar piedras",
    icon: Trash2,
    bgColor: "bg-mint-100",
    hoverColor: "hover:bg-mint-200",
    iconColor: "text-mint-600",
  },
  {
    id: "snack",
    label: "Dar snack",
    icon: Cookie,
    bgColor: "bg-cream-200",
    hoverColor: "hover:bg-cream-300",
    iconColor: "text-amber-600",
  },
  {
    id: "play",
    label: "Jugar",
    icon: Gamepad2,
    bgColor: "bg-purple-100",
    hoverColor: "hover:bg-purple-200",
    iconColor: "text-purple-600",
  },
]

function Confetti() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: Math.random() * -200 - 50,
    rotation: Math.random() * 360,
    color: ["#FFB5A7", "#B8E0D2", "#FEC89A", "#D8B4FE"][Math.floor(Math.random() * 4)],
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: p.color,
            left: "50%",
            top: "50%",
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            rotate: p.rotation,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}

export function CareActions({ onFeed, onClean, onSnack, onPlay }: CareActionsProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  const handlers: Record<string, () => void> = {
    feed: onFeed,
    clean: onClean,
    snack: onSnack,
    play: () => {
      onPlay()
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1000)
    },
  }

  return (
    <>
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            onClick={handlers[action.id]}
            className={`flex flex-col items-center gap-2 p-4 rounded-3xl ${action.bgColor} ${action.hoverColor} transition-colors shadow-md`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
          >
            <action.icon className={`w-8 h-8 ${action.iconColor}`} />
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </>
  )
}
