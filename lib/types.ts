export type CatMood = "happy" | "sad" | "sleeping"

export type Caregiver = "Cuidador 1" | "Cuidador 2"

export interface CatNeeds {
  hunger: number
  hygiene: number
  fun: number
}

export interface ActivityLog {
  id: string
  caregiver: Caregiver
  action: string
  timestamp: Date
}

export interface VetAppointment {
  id: string
  title: string
  date: Date
  type: "vaccine" | "checkup" | "treatment"
}

export interface MedicalRecord {
  weight: number
  lastVaccine: Date
  lastDeworming: Date
  notes: string[]
}

export interface CaregiverStats {
  caregiver: Caregiver
  tasksThisWeek: number
}
