import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { inviteCode } = body

    if (!inviteCode) {
      return NextResponse.json({ error: "Código de invitación requerido" }, { status: 400 })
    }

    const cleanCode = inviteCode.trim().toUpperCase()

    // Find the cat
    const cat = await prisma.cat.findUnique({
      where: { inviteCode: cleanCode },
    })

    if (!cat) {
      return NextResponse.json({ error: "No se encontró ningún gatito con ese código" }, { status: 404 })
    }

    // Check if user is already a caregiver
    const existingCaregiver = await prisma.catCaregiver.findUnique({
      where: {
        catId_userId: {
          catId: cat.id,
          userId: session.user.id,
        },
      },
    })

    if (existingCaregiver) {
      return NextResponse.json({ error: "Ya eres cuidador de este gatito" }, { status: 400 })
    }

    // Associate user with the cat
    await prisma.catCaregiver.create({
      data: {
        catId: cat.id,
        userId: session.user.id,
        role: "co-parent",
      },
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        catId: cat.id,
        userId: session.user.id,
        userName: session.user.name || "Cuidador",
        action: "se unió como cuidador",
      },
    })

    return NextResponse.json({ success: true, catId: cat.id })
  } catch (error) {
    console.error("Error joining cat:", error)
    return NextResponse.json({ error: "Error joining cat" }, { status: 500 })
  }
}
