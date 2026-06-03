"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { Bell, Moon, Share2, HelpCircle, Shield, Heart, ChevronRight, Copy, Check, RefreshCw, LogOut } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

export function SettingsScreen() {
  const { activeCat, clearActiveCat } = useAppStore()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!activeCat) return null

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(activeCat.inviteCode)
    setCopied(true)
    toast.success("¡Código de invitación copiado!")
    setTimeout(() => setCopied(false), 2000)
  }

  const settingsItems = [
    {
      icon: Bell,
      label: "Notificaciones",
      description: "Recordatorios de cuidado",
      hasSwitch: true,
      checked: notifications,
      onCheckedChange: setNotifications,
    },
    {
      icon: Moon,
      label: "Modo Oscuro",
      description: "Cambiar tema de la app",
      hasSwitch: true,
      checked: darkMode,
      onCheckedChange: setDarkMode,
    },
  ]

  return (
    <motion.div
      className="flex flex-col gap-6 p-4 pb-28"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="text-2xl font-bold text-gray-800">Ajustes</h1>

      {/* Cat Profile Card */}
      <div className="bg-gradient-to-br from-peach-100 to-cream-100 rounded-[2.5rem] p-6 shadow-lg border border-peach-200/40 relative overflow-hidden">
        {/* Sparkle background details */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-9xl pointer-events-none select-none">
          😺
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-md border border-peach-200/20">
            😺
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 leading-tight">
              {activeCat.name}
            </h2>
            <p className="text-xs text-gray-600 font-medium mt-0.5">
              {activeCat.breed || "Común Europeo"}
            </p>
            <p className="text-[10px] text-gray-500 font-semibold mt-1.5 bg-white/60 px-2 py-0.5 rounded-full inline-block">
              {activeCat.age || "2 años"} de edad
            </p>
          </div>
        </div>
      </div>

      {/* Invitation Code Section */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 pl-0.5">
            Código de Co-Cuidado
          </span>
          <p className="font-mono font-extrabold text-gray-800 text-lg tracking-wider">
            {activeCat.inviteCode}
          </p>
        </div>
        <Button
          onClick={handleCopyInviteCode}
          variant="outline"
          className="rounded-2xl border-peach-200 text-peach-600 hover:bg-peach-50 flex items-center gap-2 h-11 px-4"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          <span className="text-xs font-semibold">{copied ? "Copiado" : "Copiar"}</span>
        </Button>
      </div>

      {/* Settings Options List */}
      <div className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden">
        {settingsItems.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-center gap-4 p-4 ${
              index !== settingsItems.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="w-10 h-10 bg-cream-100 rounded-2xl flex items-center justify-center">
              <item.icon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
              <p className="text-xs text-gray-400">{item.description}</p>
            </div>
            <Switch
              checked={item.checked}
              onCheckedChange={item.onCheckedChange}
            />
          </div>
        ))}
      </div>

      {/* Switch Cat & Sign Out Flow */}
      <div className="space-y-3">
        <Button
          onClick={clearActiveCat}
          variant="outline"
          className="w-full h-12 rounded-2xl border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 font-semibold shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-gray-400" />
          <span>Cambiar de Gatito</span>
        </Button>

        <Button
          onClick={() => signOut()}
          variant="ghost"
          className="w-full h-12 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>

      {/* App Info */}
      <div className="text-center pt-2">
        <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
          <span>Hecho con</span>
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>para los gatitos</span>
        </div>
        <p className="text-[10px] text-gray-300 mt-1">MiauCare v2.0.0</p>
      </div>
    </motion.div>
  )
}
