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
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: "Contenido requerido" }, { status: 400 })
    }

    const vetNote = await prisma.vetNote.create({
      data: {
        catId: id,
        content,
      },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        catId: id,
        userId: session.user.id,
        userName: session.user.name || "Cuidador",
        action: `añadió una nota de visita médica`,
      },
    })

    return NextResponse.json(vetNote)
  } catch (error) {
    console.error("Error creating vet note:", error)
    return NextResponse.json({ error: "Error creating vet note" }, { status: 500 })
  }
}
