"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Users, Heart, LogOut, ArrowRight, UserPlus, FileText, Sparkles, ChevronRight } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function CatSelectorScreen() {
  const { data: session } = useSession()
  const { cats, isLoading, fetchCats, selectCat, createCat, joinCat } = useAppStore()
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  
  // Forms
  const [name, setName] = useState("")
  const [breed, setBreed] = useState("")
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [inviteCode, setInviteCode] = useState("")

  useEffect(() => {
    fetchCats()
  }, [fetchCats])

  const handleCreateCat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const newCat = await createCat(
      name.trim(),
      breed.trim() || "Común Europeo",
      age.trim() || "2 años",
      parseFloat(weight) || 4.2
    )

    if (newCat) {
      toast.success(`¡${name} ha sido registrado!`)
      setShowCreateModal(false)
      setName("")
      setBreed("")
      setAge("")
      setWeight("")
      // Auto-select the newly created cat
      selectCat(newCat.id)
    } else {
      toast.error("Error al registrar el gatito")
    }
  }

  const handleJoinCat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteCode.trim()) return

    const success = await joinCat(inviteCode.trim())
    if (success) {
      toast.success("¡Te has unido correctamente al cuidado!")
      setShowJoinModal(false)
      setInviteCode("")
    } else {
      toast.error("Código de invitación inválido o ya eres cuidador")
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 p-6 pb-12">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-500">Bienvenido,</h1>
            <h2 className="text-2xl font-bold text-gray-800 leading-tight">
              {session?.user?.name || "Cuidador"} 👋
            </h2>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => signOut()}
            className="rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Cats list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider pl-1">
              Mis Gatitos
            </h3>
            {isLoading && <span className="text-xs text-gray-400 animate-pulse">Cargando...</span>}
          </div>

          <AnimatePresence mode="popLayout">
            {cats.length === 0 && !isLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 text-center flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 bg-peach-50 rounded-full flex items-center justify-center text-3xl">
                  😺
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-800">No tienes gatitos registrados</p>
                  <p className="text-xs text-gray-500 max-w-[200px] mx-auto">
                    Crea un nuevo gatito o únete a uno existente usando el código de tu compañero.
                  </p>
                </div>
              </motion.div>
            ) : (
              cats.map((cat, idx) => {
                const avgNeeds = (cat.hunger + cat.hygiene + cat.fun) / 3
                let emoji = "😺"
                let mood = "Feliz"
                if (avgNeeds < 30) {
                  emoji = "😿"
                  mood = "Triste"
                } else if (avgNeeds < 50) {
                  emoji = "😴"
                  mood = "Con sueño"
                }

                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 } }}
                    exit={{ opacity: 0, y: -15 }}
                    whileHover={{ y: -2 }}
                    onClick={() => selectCat(cat.id)}
                    className="bg-white rounded-[2rem] p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-4 relative overflow-hidden group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-peach-100 to-cream-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                      {emoji}
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-800 text-lg truncate pr-2">
                          {cat.name}
                        </h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          avgNeeds < 30 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"
                        }`}>
                          {mood}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 truncate">
                        {cat.breed} • {cat.age}
                      </p>

                      {/* Needs summary dots */}
                      <div className="flex gap-4 pt-1.5">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-peach-400" />
                          <span className="text-[10px] text-gray-400 font-medium">Hambre: {Math.round(cat.hunger)}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-mint-400" />
                          <span className="text-[10px] text-gray-400 font-medium">Higiene: {Math.round(cat.hygiene)}%</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-peach-500 group-hover:translate-x-1 transition-all duration-300" />
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>

        {/* Buttons flow */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="h-16 rounded-[1.75rem] bg-gradient-to-br from-peach-400 to-peach-500 hover:from-peach-500 hover:to-peach-600 text-white font-semibold flex flex-col items-center justify-center gap-1 shadow-lg shadow-peach-500/10 transition-transform duration-200 active:scale-95 border-0"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">Registrar Gatito</span>
          </Button>

          <Button
            onClick={() => setShowJoinModal(true)}
            variant="outline"
            className="h-16 rounded-[1.75rem] bg-white border-gray-200 text-gray-700 font-semibold flex flex-col items-center justify-center gap-1 shadow-md hover:bg-gray-50 transition-transform duration-200 active:scale-95"
          >
            <UserPlus className="w-5 h-5 text-mint-500" />
            <span className="text-xs">Unirse con Código</span>
          </Button>
        </div>

      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="bg-white rounded-[2.5rem] p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-peach-500" />
                Registrar Gatito
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Completa los datos de tu nuevo compañero felino.
              </p>

              <form onSubmit={handleCreateCat} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">Nombre *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Garfield, Salem..."
                    required
                    className="rounded-xl border-gray-200 h-11 focus-visible:ring-peach-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">Raza</label>
                    <Input
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                      placeholder="Ej. Persa, Siamés"
                      className="rounded-xl border-gray-200 h-11 focus-visible:ring-peach-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">Edad</label>
                    <Input
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Ej. 1 año, 3 meses"
                      className="rounded-xl border-gray-200 h-11 focus-visible:ring-peach-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">Peso (kg)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Ej. 4.2"
                    className="rounded-xl border-gray-200 h-11 focus-visible:ring-peach-400"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 h-11 rounded-xl"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-peach-500 hover:bg-peach-600 text-white"
                  >
                    Crear Gatito
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              className="bg-white rounded-[2.5rem] p-6 w-full max-w-sm shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Users className="w-6 h-6 text-mint-500" />
                Unirse con Código
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Ingresa el código de invitación del gatito (ej. MIAU-XXXX) que te compartió su dueño.
              </p>

              <form onSubmit={handleJoinCat} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">Código de Invitación</label>
                  <Input
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="MIAU-XXXXXX"
                    required
                    className="rounded-xl border-gray-200 h-11 focus-visible:ring-mint-400 text-center font-mono text-lg uppercase tracking-widest"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 h-11 rounded-xl"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-mint-500 hover:bg-mint-600 text-white"
                  >
                    Unirse
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
