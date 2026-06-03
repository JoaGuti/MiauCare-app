"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scale, Syringe, Bug, Calendar, Phone, MapPin, Plus, X } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Sin registro"
  }
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function daysUntil(date: Date): number {
  if (!(date instanceof Date) || isNaN(date.getTime())) return 0
  const diff = date.getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function HealthScreen() {
  const { medicalRecord, appointments, addVetNote, addAppointment } = useAppStore()
  
  const [showEmergency, setShowEmergency] = useState(false)
  
  // Note Modal
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [newNote, setNewNote] = useState("")

  // Appointment Modal
  const [showAptModal, setShowAptModal] = useState(false)
  const [aptTitle, setAptTitle] = useState("")
  const [aptDate, setAptDate] = useState("")
  const [aptType, setAptType] = useState<"vaccine" | "checkup" | "treatment">("checkup")

  const handleAddNote = async () => {
    if (newNote.trim()) {
      await addVetNote(newNote.trim())
      setNewNote("")
      setShowNoteModal(false)
      toast.success("Nota médica guardada")
    }
  }

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aptTitle.trim() || !aptDate) return

    await addAppointment(aptTitle.trim(), new Date(aptDate), aptType)
    setAptTitle("")
    setAptDate("")
    setAptType("checkup")
    setShowAptModal(false)
    toast.success("Cita agendada correctamente")
  }

  const typeIcons = {
    vaccine: Syringe,
    checkup: Calendar,
    treatment: Bug,
  }

  const typeColors = {
    vaccine: "bg-blue-100 text-blue-600",
    checkup: "bg-amber-100 text-amber-600",
    treatment: "bg-purple-100 text-purple-600",
  }

  const typeLabels = {
    vaccine: "Vacunación",
    checkup: "Chequeo",
    treatment: "Desparasitación / Tratamiento",
  }

  return (
    <motion.div
      className="flex flex-col gap-6 p-4 pb-28"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="text-2xl font-bold text-gray-800">Salud</h1>

      {/* Medical Record Card */}
      <div className="bg-white rounded-[2rem] p-5 shadow-md border border-gray-100/50">
        <h2 className="font-bold text-gray-700 text-sm mb-4 uppercase tracking-wider pl-1">
          Expediente Médico
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-cream-50 rounded-2xl p-3 text-center flex flex-col justify-center items-center">
            <Scale className="w-5 h-5 mb-1.5 text-peach-500" />
            <p className="text-base font-bold text-gray-800">{medicalRecord.weight} kg</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Peso actual</p>
          </div>
          <div className="bg-cream-50 rounded-2xl p-3 text-center flex flex-col justify-center items-center">
            <Syringe className="w-5 h-5 mb-1.5 text-blue-500" />
            <p className="text-xs font-bold text-gray-800 truncate max-w-full">
              {formatDate(medicalRecord.lastVaccine)}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Última vacuna</p>
          </div>
          <div className="bg-cream-50 rounded-2xl p-3 text-center flex flex-col justify-center items-center">
            <Bug className="w-5 h-5 mb-1.5 text-green-500" />
            <p className="text-xs font-bold text-gray-800 truncate max-w-full">
              {formatDate(medicalRecord.lastDeworming)}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Antiparasitario</p>
          </div>
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-white rounded-[2rem] p-5 shadow-md border border-gray-100/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider pl-1">
            Próximas Citas
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAptModal(true)}
            className="rounded-full h-8 px-3 text-xs border-peach-200 text-peach-600 hover:bg-peach-50"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Agendar
          </Button>
        </div>

        {appointments.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No hay citas médicas pendientes.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => {
              const Icon = typeIcons[apt.type] || Calendar
              const days = daysUntil(apt.date)
              return (
                <motion.div
                  key={apt.id}
                  className="flex items-center gap-3 p-3 bg-cream-50 rounded-2xl border border-cream-200/50"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${typeColors[apt.type] || "bg-gray-100 text-gray-500"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{apt.title}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{formatDate(apt.date)}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    days <= 2 ? "bg-red-100 text-red-600" : days <= 7 ? "bg-amber-100 text-amber-600" : "bg-peach-100 text-peach-600"
                  }`}>
                    {days <= 0 ? "Hoy" : `En ${days} d`}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Vet Notes */}
      <div className="bg-white rounded-[2rem] p-5 shadow-md border border-gray-100/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider pl-1">
            Notas de Visitas
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNoteModal(true)}
            className="rounded-full h-8 px-3 text-xs border-peach-200 text-peach-600 hover:bg-peach-50"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Añadir
          </Button>
        </div>

        {medicalRecord.notes.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">Aún no hay notas de visitas médicas.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {medicalRecord.notes.map((note, i) => (
              <div key={i} className="p-3 bg-cream-50 rounded-xl text-xs text-gray-700 border border-cream-200/30">
                {note}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Button */}
      <motion.button
        onClick={() => setShowEmergency(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full shadow-lg flex items-center justify-center z-40 text-white"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <Phone className="w-5 h-5 fill-white" />
      </motion.button>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergency && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEmergency(false)}
          >
            <motion.div
              className="bg-white rounded-[2.5rem] p-6 w-full max-w-sm shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-red-600">Emergencia Médica</h3>
                <button
                  onClick={() => setShowEmergency(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <a
                  href="tel:+34900123456"
                  className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100/70 rounded-2xl transition-colors"
                >
                  <Phone className="w-6 h-6 text-red-500 fill-red-500/20" />
                  <div>
                    <p className="font-bold text-sm text-gray-800">Veterinario 24h</p>
                    <p className="text-xs text-red-600">+34 900 123 456</p>
                  </div>
                </a>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                  <MapPin className="w-6 h-6 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-gray-800">Clínica MiauVet</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">
                      Calle de los Gatos, 123
                      <br />
                      28001 Madrid
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Creation Modal */}
      <AnimatePresence>
        {showAptModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAptModal(false)}
          >
            <motion.div
              className="bg-white rounded-[2.5rem] p-6 w-full max-w-sm shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Agendar Cita Médica</h3>
                <button
                  onClick={() => setShowAptModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddAppointment} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">Título de la cita *</label>
                  <Input
                    value={aptTitle}
                    onChange={(e) => setAptTitle(e.target.value)}
                    placeholder="Ej. Control de peso, Vacuna rabia..."
                    required
                    className="rounded-xl border-gray-200 h-11 focus-visible:ring-peach-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">Fecha de la cita *</label>
                  <Input
                    type="date"
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    required
                    className="rounded-xl border-gray-200 h-11 focus-visible:ring-peach-400 text-gray-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">Tipo de visita *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["checkup", "vaccine", "treatment"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAptType(t)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          aptType === t
                            ? "border-peach-500 bg-peach-50 text-peach-600 shadow-sm"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {t === "checkup" ? "Chequeo" : t === "vaccine" ? "Vacuna" : "Tratamiento"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAptModal(false)}
                    className="flex-1 h-11 rounded-xl"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-peach-500 hover:bg-peach-600 text-white"
                  >
                    Agendar Cita
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note Modal */}
      <AnimatePresence>
        {showNoteModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNoteModal(false)}
          >
            <motion.div
              className="bg-white rounded-[2.5rem] p-6 w-full max-w-sm shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">Nueva Nota Médica</h3>
              <p className="text-xs text-gray-500 mb-4">Anota observaciones de la visita al veterinario.</p>
              
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Escribe aquí las indicaciones del veterinario, medicamentos, peso, etc..."
                className="mb-4 rounded-2xl border-gray-200 focus-visible:ring-peach-400 focus:bg-white bg-cream-50/20"
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 h-11 rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="flex-1 h-11 rounded-xl bg-peach-500 hover:bg-peach-600 text-white"
                >
                  Guardar Nota
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
