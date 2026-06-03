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
    const { title, date, type } = body

    if (!title || !date || !type) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const appointment = await prisma.vetAppointment.create({
      data: {
        catId: id,
        title,
        date: new Date(date),
        type,
      },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        catId: id,
        userId: session.user.id,
        userName: session.user.name || "Cuidador",
        action: `agendó cita médica: ${title}`,
      },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Error creating appointment" }, { status: 500 })
  }
}
