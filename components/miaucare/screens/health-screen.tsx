"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scale, Syringe, Bug, Calendar, Phone, MapPin, Plus, X } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function daysUntil(date: Date): number {
  const diff = date.getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function HealthScreen() {
  const { medicalRecord, appointments, addVetNote } = useAppStore()
  const [showEmergency, setShowEmergency] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [newNote, setNewNote] = useState("")

  const handleAddNote = () => {
    if (newNote.trim()) {
      addVetNote(newNote.trim())
      setNewNote("")
      setShowNoteModal(false)
    }
  }

  const typeIcons = {
    vaccine: Syringe,
    checkup: Calendar,
    treatment: Bug,
  }

  const typeColors = {
    vaccine: "bg-blue-100 text-blue-600",
    checkup: "bg-mint-100 text-mint-600",
    treatment: "bg-purple-100 text-purple-600",
  }

  return (
    <motion.div
      className="flex flex-col gap-6 p-4 pb-28"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="text-2xl font-bold text-gray-800">Salud</h1>

      {/* Medical Record */}
      <div className="bg-white rounded-3xl p-4 shadow-lg">
        <h2 className="font-semibold text-gray-700 mb-4">Expediente Médico</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-cream-50 rounded-2xl p-3 text-center">
            <Scale className="w-6 h-6 mx-auto mb-1 text-peach-500" />
            <p className="text-lg font-bold text-gray-800">{medicalRecord.weight} kg</p>
            <p className="text-xs text-gray-500">Peso actual</p>
          </div>
          <div className="bg-cream-50 rounded-2xl p-3 text-center">
            <Syringe className="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <p className="text-sm font-semibold text-gray-800">
              {formatDate(medicalRecord.lastVaccine)}
            </p>
            <p className="text-xs text-gray-500">Última vacuna</p>
          </div>
          <div className="bg-cream-50 rounded-2xl p-3 text-center">
            <Bug className="w-6 h-6 mx-auto mb-1 text-green-500" />
            <p className="text-sm font-semibold text-gray-800">
              {formatDate(medicalRecord.lastDeworming)}
            </p>
            <p className="text-xs text-gray-500">Desparasitación</p>
          </div>
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-white rounded-3xl p-4 shadow-lg">
        <h2 className="font-semibold text-gray-700 mb-4">Próximas Citas</h2>
        <div className="space-y-3">
          {appointments.map((apt) => {
            const Icon = typeIcons[apt.type]
            const days = daysUntil(apt.date)
            return (
              <motion.div
                key={apt.id}
                className="flex items-center gap-3 p-3 bg-cream-50 rounded-2xl"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColors[apt.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{apt.title}</p>
                  <p className="text-xs text-gray-500">{formatDate(apt.date)}</p>
                </div>
                <div className="bg-peach-100 px-2 py-1 rounded-full">
                  <span className="text-xs font-semibold text-peach-600">
                    {days} días
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Vet Notes */}
      <div className="bg-white rounded-3xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">Notas de Visitas</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNoteModal(true)}
            className="rounded-full"
          >
            <Plus className="w-4 h-4 mr-1" />
            Añadir
          </Button>
        </div>
        <div className="space-y-2">
          {medicalRecord.notes.map((note, i) => (
            <div key={i} className="p-3 bg-cream-50 rounded-xl text-sm text-gray-700">
              {note}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Button */}
      <motion.button
        onClick={() => setShowEmergency(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-red-500 rounded-full shadow-lg flex items-center justify-center z-40"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <Phone className="w-6 h-6 text-white" />
      </motion.button>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergency && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEmergency(false)}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-red-600">Emergencia</h3>
                <button
                  onClick={() => setShowEmergency(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <a
                  href="tel:+34900123456"
                  className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl"
                >
                  <Phone className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-800">Veterinario 24h</p>
                    <p className="text-sm text-red-600">+34 900 123 456</p>
                  </div>
                </a>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                  <MapPin className="w-6 h-6 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Clínica MiauVet</p>
                    <p className="text-sm text-gray-600">
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

      {/* Note Modal */}
      <AnimatePresence>
        {showNoteModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNoteModal(false)}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Nueva Nota</h3>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Escribe los detalles de la visita..."
                className="mb-4 rounded-2xl"
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 rounded-full"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddNote}
                  className="flex-1 rounded-full bg-peach-500 hover:bg-peach-600"
                >
                  Guardar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
