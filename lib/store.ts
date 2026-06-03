"use client"

import { create } from "zustand"
import type { CatNeeds, ActivityLog, VetAppointment, MedicalRecord, CaregiverStats } from "./types"

interface ActiveCatData {
  id: string
  name: string
  breed: string | null
  age: string | null
  inviteCode: string
  weight: number
  lastVaccine: Date
  lastDeworming: Date
  hunger: number
  hygiene: number
  fun: number
  caregivers: Array<{ id: string; name: string; image: string | null; role: string }>
}

interface AppState {
  // Authentication & List
  cats: ActiveCatData[]
  activeCatId: string | null
  activeCat: ActiveCatData | null
  isLoading: boolean
  
  // Active Cat Care States
  catNeeds: CatNeeds
  streak: number
  activityLog: ActivityLog[]
  appointments: VetAppointment[]
  medicalRecord: MedicalRecord
  caregiverStats: CaregiverStats[]

  // Sync helpers
  ticksSinceLastSync: number

  // Actions
  fetchCats: () => Promise<void>
  selectCat: (id: string) => Promise<void>
  createCat: (name: string, breed: string, age: string, weight: number) => Promise<any>
  joinCat: (inviteCode: string) => Promise<boolean>
  clearActiveCat: () => void

  // Care actions
  feed: () => Promise<void>
  clean: () => Promise<void>
  giveSnack: () => Promise<void>
  play: () => Promise<void>
  decreaseNeeds: () => void
  addVetNote: (note: string) => Promise<void>
  addAppointment: (title: string, date: Date, type: "vaccine" | "checkup" | "treatment") => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  cats: [],
  activeCatId: null,
  activeCat: null,
  isLoading: false,

  catNeeds: {
    hunger: 75,
    hygiene: 80,
    fun: 60,
  },
  streak: 0,
  activityLog: [],
  appointments: [],
  medicalRecord: {
    weight: 4.2,
    lastVaccine: new Date(),
    lastDeworming: new Date(),
    notes: [],
  },
  caregiverStats: [],
  ticksSinceLastSync: 0,

  fetchCats: async () => {
    set({ isLoading: true })
    try {
      const res = await fetch("/api/cats")
      if (res.ok) {
        const data = await res.json()
        set({ cats: data })
      }
    } catch (e) {
      console.error("Error fetching cats:", e)
    } finally {
      set({ isLoading: false })
    }
  },

  selectCat: async (id: string) => {
    set({ isLoading: true, activeCatId: id })
    try {
      const res = await fetch(`/api/cats/${id}`)
      if (res.ok) {
        const cat = await res.json()
        
        // Parse dates
        const appointments = cat.appointments.map((a: any) => ({
          ...a,
          date: new Date(a.date)
        }))
        
        const medicalRecord: MedicalRecord = {
          weight: cat.weight,
          lastVaccine: new Date(cat.lastVaccine),
          lastDeworming: new Date(cat.lastDeworming),
          notes: cat.medicalNotes.map((n: any) => n.content),
        }

        const activityLog = cat.activities.map((act: any) => ({
          id: act.id,
          caregiver: act.userName,
          action: act.action,
          timestamp: new Date(act.timestamp),
        }))

        set({
          activeCat: {
            id: cat.id,
            name: cat.name,
            breed: cat.breed,
            age: cat.age,
            inviteCode: cat.inviteCode,
            weight: cat.weight,
            lastVaccine: new Date(cat.lastVaccine),
            lastDeworming: new Date(cat.lastDeworming),
            hunger: cat.hunger,
            hygiene: cat.hygiene,
            fun: cat.fun,
            caregivers: cat.caregivers,
          },
          catNeeds: {
            hunger: cat.hunger,
            hygiene: cat.hygiene,
            fun: cat.fun,
          },
          streak: cat.streak,
          appointments,
          medicalRecord,
          activityLog,
          caregiverStats: cat.caregiverStats,
        })
      }
    } catch (e) {
      console.error("Error selecting cat:", e)
    } finally {
      set({ isLoading: false })
    }
  },

  createCat: async (name, breed, age, weight) => {
    set({ isLoading: true })
    try {
      const res = await fetch("/api/cats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, breed, age, weight }),
      })
      if (res.ok) {
        const newCat = await res.json()
        set((state) => ({ cats: [...state.cats, newCat] }))
        return newCat
      }
    } catch (e) {
      console.error("Error creating cat:", e)
    } finally {
      set({ isLoading: false })
    }
    return null
  },

  joinCat: async (inviteCode) => {
    set({ isLoading: true })
    try {
      const res = await fetch("/api/cats/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      })
      if (res.ok) {
        await get().fetchCats()
        return true
      }
    } catch (e) {
      console.error("Error joining cat:", e)
    } finally {
      set({ isLoading: false })
    }
    return false
  },

  clearActiveCat: () => {
    set({
      activeCatId: null,
      activeCat: null,
      catNeeds: { hunger: 50, hygiene: 50, fun: 50 },
      streak: 0,
      activityLog: [],
      appointments: [],
      medicalRecord: { weight: 4.2, lastVaccine: new Date(), lastDeworming: new Date(), notes: [] },
      caregiverStats: [],
    })
  },

  feed: async () => {
    const id = get().activeCatId
    if (!id) return

    // Optimistic Update
    set((state) => ({
      catNeeds: { ...state.catNeeds, hunger: Math.min(100, state.catNeeds.hunger + 30) },
    }))

    try {
      const res = await fetch(`/api/cats/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "feed" }),
      })
      if (res.ok) {
        await get().selectCat(id) // Refresh full details and activity log
      }
    } catch (e) {
      console.error(e)
    }
  },

  clean: async () => {
    const id = get().activeCatId
    if (!id) return

    // Optimistic Update
    set((state) => ({
      catNeeds: { ...state.catNeeds, hygiene: Math.min(100, state.catNeeds.hygiene + 35) },
    }))

    try {
      const res = await fetch(`/api/cats/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clean" }),
      })
      if (res.ok) {
        await get().selectCat(id)
      }
    } catch (e) {
      console.error(e)
    }
  },

  giveSnack: async () => {
    const id = get().activeCatId
    if (!id) return

    // Optimistic Update
    set((state) => ({
      catNeeds: { ...state.catNeeds, fun: Math.min(100, state.catNeeds.fun + 10) },
    }))

    try {
      const res = await fetch(`/api/cats/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "snack" }),
      })
      if (res.ok) {
        await get().selectCat(id)
      }
    } catch (e) {
      console.error(e)
    }
  },

  play: async () => {
    const id = get().activeCatId
    if (!id) return

    // Optimistic Update
    set((state) => ({
      catNeeds: { ...state.catNeeds, fun: Math.min(100, state.catNeeds.fun + 25) },
    }))

    try {
      const res = await fetch(`/api/cats/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "play" }),
      })
      if (res.ok) {
        await get().selectCat(id)
      }
    } catch (e) {
      console.error(e)
    }
  },

  decreaseNeeds: () => {
    const id = get().activeCatId
    if (!id) return

    set((state) => {
      const newNeeds = {
        hunger: Math.max(0, state.catNeeds.hunger - 0.2), // slow down local decay a bit
        hygiene: Math.max(0, state.catNeeds.hygiene - 0.1),
        fun: Math.max(0, state.catNeeds.fun - 0.15),
      }
      
      const isHealthy = newNeeds.hunger > 20 && newNeeds.hygiene > 20 && newNeeds.fun > 20
      const nextTicks = state.ticksSinceLastSync + 1

      // Periodically sync needs with the server (every 10 ticks = 30 seconds)
      if (nextTicks >= 10) {
        fetch(`/api/cats/${id}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sync",
            needs: {
              ...newNeeds,
              streak: isHealthy ? state.streak : 0,
            },
          }),
        }).catch(console.error)
        
        return {
          catNeeds: newNeeds,
          streak: isHealthy ? state.streak : 0,
          ticksSinceLastSync: 0,
        }
      }

      return {
        catNeeds: newNeeds,
        streak: isHealthy ? state.streak : 0,
        ticksSinceLastSync: nextTicks,
      }
    })
  },

  addVetNote: async (note) => {
    const id = get().activeCatId
    if (!id) return

    try {
      const res = await fetch(`/api/cats/${id}/vet-note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: note }),
      })
      if (res.ok) {
        await get().selectCat(id)
      }
    } catch (e) {
      console.error(e)
    }
  },

  addAppointment: async (title, date, type) => {
    const id = get().activeCatId
    if (!id) return

    try {
      const res = await fetch(`/api/cats/${id}/appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, type }),
      })
      if (res.ok) {
        await get().selectCat(id)
      }
    } catch (e) {
      console.error(e)
    }
  },
}))
