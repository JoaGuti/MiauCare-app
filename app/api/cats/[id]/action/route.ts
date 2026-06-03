import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  
  try {
    const access = await prisma.catCaregiver.findUnique({
      where: {
        catId_userId: {
          catId: id,
          userId: session.user.id,
        },
      },
    })

    if (!access) {
      return NextResponse.json({ error: "No tienes permiso" }, { status: 403 })
    }

    const body = await request.json()
    const { action, needs } = body

    const cat = await prisma.cat.findUnique({
      where: { id },
    })

    if (!cat) {
      return NextResponse.json({ error: "Gatito no encontrado" }, { status: 404 })
    }

    let updatedHunger = cat.hunger
    let updatedHygiene = cat.hygiene
    let updatedFun = cat.fun
    let updatedStreak = cat.streak
    let actionLabel = ""

    if (action === "feed") {
      updatedHunger = Math.min(100, cat.hunger + 30)
      actionLabel = "le dio de comer"
    } else if (action === "clean") {
      updatedHygiene = Math.min(100, cat.hygiene + 35)
      actionLabel = "limpió las piedras"
    } else if (action === "snack") {
      updatedFun = Math.min(100, cat.fun + 10)
      actionLabel = "le dio un snack"
    } else if (action === "play") {
      updatedFun = Math.min(100, cat.fun + 25)
      actionLabel = "jugó con el gatito"
    } else if (action === "sync" && needs) {
      updatedHunger = needs.hunger
      updatedHygiene = needs.hygiene
      updatedFun = needs.fun
      updatedStreak = needs.streak
    }

    const isHealthy = updatedHunger > 20 && updatedHygiene > 20 && updatedFun > 20
    if (!isHealthy) {
      updatedStreak = 0
    }

    const updatedCat = await prisma.cat.update({
      where: { id },
      data: {
        hunger: updatedHunger,
        hygiene: updatedHygiene,
        fun: updatedFun,
        streak: updatedStreak,
      },
    })

    if (actionLabel) {
      await prisma.activityLog.create({
        data: {
          catId: id,
          userId: session.user.id,
          userName: session.user.name || "Cuidador",
          action: actionLabel,
        },
      })
    }

    return NextResponse.json(updatedCat)
  } catch (error) {
    console.error("Error executing action:", error)
    return NextResponse.json({ error: "Error executing action" }, { status: 500 })
  }
}
