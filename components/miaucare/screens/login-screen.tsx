"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { Cat, Chrome, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginScreen() {
  const [demoName, setDemoName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = () => {
    setIsLoading(true)
    signIn("google")
  }

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!demoName.trim()) return
    setIsLoading(true)
    signIn("credentials", {
      username: demoName.trim(),
      callbackUrl: "/",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 via-cream-50 to-orange-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Floating Blobs */}
      <motion.div
        className="absolute w-64 h-64 bg-peach-200/40 rounded-full blur-3xl -top-20 -left-20"
        animate={{
          x: [0, 40, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-orange-200/30 rounded-full blur-3xl -bottom-20 -right-20"
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl border border-white/50 z-10 flex flex-col items-center">
        {/* Animated Brand Logo */}
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-peach-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-6"
          animate={{
            y: [0, -6, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Cat className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-4xl font-extrabold text-gray-800 text-center tracking-tight mb-2">
          MiauCare
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8 max-w-xs">
          Cuiden juntos a sus gatitos. Mantengan su salud, felicidad y registren cada aventura.
        </p>

        {/* Google Login Button */}
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-semibold shadow-md border border-gray-100 flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50"
        >
          <Chrome className="w-5 h-5 text-red-500" />
          <span>Iniciar sesión con Google</span>
        </Button>

        {/* Divider */}
        <div className="flex items-center w-full my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 px-3 uppercase tracking-wider font-semibold">
            O entrar sin Google
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Demo Mode / Developer Form */}
        <form onSubmit={handleDemoLogin} className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 pl-1">
              Nombre de Cuidador (Modo Demo)
            </label>
            <div className="relative">
              <Input
                type="text"
                value={demoName}
                onChange={(e) => setDemoName(e.target.value)}
                placeholder="Ej. Cuidador 1, Sofía, Lucas..."
                required
                disabled={isLoading}
                className="w-full h-12 pl-10 pr-4 rounded-xl border-gray-200 bg-white/50 focus:bg-white transition-colors"
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !demoName.trim()}
            className="w-full h-12 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-medium shadow-md shadow-peach-500/10 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Entrar en Modo Demo</span>
          </Button>
        </form>

        <div className="text-center mt-8">
          <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed">
            * El Modo Demo crea un usuario local en la base de datos de desarrollo de forma instantánea para facilitar las pruebas.
          </p>
        </div>
      </div>
    </div>
  )
}
