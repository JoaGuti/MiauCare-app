"use client"

import { create } from "zustand"
import type { CatNeeds, Caregiver, ActivityLog, VetAppointment, MedicalRecord, CaregiverStats } from "./types"

interface AppState {
  currentCaregiver: Caregiver
  catNeeds: CatNeeds
  streak: number
  activityLog: ActivityLog[]
  appointments: VetAppointment[]
  medicalRecord: MedicalRecord
  caregiverStats: CaregiverStats[]
  
  setCaregiver: (caregiver: Caregiver) => void
  feed: () => void
  clean: () => void
  giveSnack: () => void
  play: () => void
  decreaseNeeds: () => void
  addVetNote: (note: string) => void
}

const addActivity = (state: AppState, action: string): ActivityLog[] => {
  const newActivity: ActivityLog = {
    id: Date.now().toString(),
    caregiver: state.currentCaregiver,
    action,
    timestamp: new Date(),
  }
  return [newActivity, ...state.activityLog].slice(0, 20)
}

const updateStats = (stats: CaregiverStats[], caregiver: Caregiver): CaregiverStats[] => {
  return stats.map((s) =>
    s.caregiver === caregiver ? { ...s, tasksThisWeek: s.tasksThisWeek + 1 } : s
  )
}

export const useAppStore = create<AppState>((set, get) => ({
  currentCaregiver: "Cuidador 1",
  catNeeds: {
    hunger: 75,
    hygiene: 80,
    fun: 60,
  },
  streak: 7,
  activityLog: [
    {
      id: "1",
      caregiver: "Cuidador 1",
      action: "le dio de comer",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      caregiver: "Cuidador 2",
      action: "limpió las piedras",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "3",
      caregiver: "Cuidador 1",
      action: "jugó con el gatito",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ],
  appointments: [
    {
      id: "1",
      title: "Vacuna Rabia",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      type: "vaccine",
    },
    {
      id: "2",
      title: "Cita Veterinario",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      type: "checkup",
    },
    {
      id: "3",
      title: "Pipeta Antiparasitaria",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      type: "treatment",
    },
  ],
  medicalRecord: {
    weight: 4.2,
    lastVaccine: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    lastDeworming: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    notes: ["Revisión general - Todo bien", "Vacuna triple felina aplicada"],
  },
  caregiverStats: [
    { caregiver: "Cuidador 1", tasksThisWeek: 12 },
    { caregiver: "Cuidador 2", tasksThisWeek: 8 },
  ],

  setCaregiver: (caregiver) => set({ currentCaregiver: caregiver }),

  feed: () =>
    set((state) => ({
      catNeeds: { ...state.catNeeds, hunger: Math.min(100, state.catNeeds.hunger + 30) },
      activityLog: addActivity(state, "le dio de comer"),
      caregiverStats: updateStats(state.caregiverStats, state.currentCaregiver),
    })),

  clean: () =>
    set((state) => ({
      catNeeds: { ...state.catNeeds, hygiene: Math.min(100, state.catNeeds.hygiene + 35) },
      activityLog: addActivity(state, "limpió las piedras"),
      caregiverStats: updateStats(state.caregiverStats, state.currentCaregiver),
    })),

  giveSnack: () =>
    set((state) => ({
      catNeeds: { ...state.catNeeds, fun: Math.min(100, state.catNeeds.fun + 10) },
      activityLog: addActivity(state, "le dio un snack"),
      caregiverStats: updateStats(state.caregiverStats, state.currentCaregiver),
    })),

  play: () =>
    set((state) => ({
      catNeeds: { ...state.catNeeds, fun: Math.min(100, state.catNeeds.fun + 25) },
      activityLog: addActivity(state, "jugó con el gatito"),
      caregiverStats: updateStats(state.caregiverStats, state.currentCaregiver),
    })),

  decreaseNeeds: () =>
    set((state) => {
      const newNeeds = {
        hunger: Math.max(0, state.catNeeds.hunger - 1),
        hygiene: Math.max(0, state.catNeeds.hygiene - 0.5),
        fun: Math.max(0, state.catNeeds.fun - 0.8),
      }
      const isHealthy = newNeeds.hunger > 20 && newNeeds.hygiene > 20 && newNeeds.fun > 20
      return {
        catNeeds: newNeeds,
        streak: isHealthy ? state.streak : 0,
      }
    }),

  addVetNote: (note) =>
    set((state) => ({
      medicalRecord: {
        ...state.medicalRecord,
        notes: [note, ...state.medicalRecord.notes],
      },
    })),
}))
