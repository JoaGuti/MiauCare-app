"use client"

import { motion } from "framer-motion"
import { Bell, Moon, Share2, HelpCircle, Shield, Heart, ChevronRight } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

const settingsItems = [
  {
    icon: Bell,
    label: "Notificaciones",
    description: "Recordatorios de cuidado",
    hasSwitch: true,
  },
  {
    icon: Moon,
    label: "Modo Oscuro",
    description: "Cambiar tema de la app",
    hasSwitch: true,
  },
  {
    icon: Share2,
    label: "Compartir Acceso",
    description: "Invitar a otro cuidador",
    hasSwitch: false,
  },
  {
    icon: Shield,
    label: "Privacidad",
    description: "Gestionar datos",
    hasSwitch: false,
  },
  {
    icon: HelpCircle,
    label: "Ayuda",
    description: "Preguntas frecuentes",
    hasSwitch: false,
  },
]

export function SettingsScreen() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const switches: Record<string, { value: boolean; setter: (v: boolean) => void }> = {
    Notificaciones: { value: notifications, setter: setNotifications },
    "Modo Oscuro": { value: darkMode, setter: setDarkMode },
  }

  return (
    <motion.div
      className="flex flex-col gap-6 p-4 pb-28"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="text-2xl font-bold text-gray-800">Ajustes</h1>

      {/* Cat Profile Card */}
      <div className="bg-gradient-to-br from-peach-100 to-cream-100 rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-inner">
            😺
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Gatito</h2>
            <p className="text-sm text-gray-600">Gato Común Europeo</p>
            <p className="text-xs text-gray-500 mt-1">2 años de edad</p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {settingsItems.map((item, index) => (
          <motion.div
            key={item.label}
            className={`flex items-center gap-4 p-4 ${
              index !== settingsItems.length - 1 ? "border-b border-gray-100" : ""
            }`}
            whileTap={{ backgroundColor: "rgba(0,0,0,0.02)" }}
          >
            <div className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center">
              <item.icon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
            {item.hasSwitch ? (
              <Switch
                checked={switches[item.label].value}
                onCheckedChange={switches[item.label].setter}
              />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </motion.div>
        ))}
      </div>

      {/* App Info */}
      <div className="text-center pt-4">
        <div className="flex items-center justify-center gap-1 text-sm text-gray-400">
          <span>Hecho con</span>
          <Heart className="w-4 h-4 text-red-400 fill-red-400" />
          <span>para los gatitos</span>
        </div>
        <p className="text-xs text-gray-300 mt-2">MiauCare v1.0.0</p>
      </div>
    </motion.div>
  )
}
