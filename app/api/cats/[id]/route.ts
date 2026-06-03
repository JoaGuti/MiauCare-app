import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Verify user has access to this cat
    const access = await prisma.catCaregiver.findUnique({
      where: {
        catId_userId: {
          catId: id,
          userId: session.user.id,
        },
      },
    })

    if (!access) {
      return NextResponse.json({ error: "No tienes permiso para ver este gatito" }, { status: 403 })
    }

    const cat = await prisma.cat.findUnique({
      where: { id },
      include: {
        caregivers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        activities: {
          orderBy: { timestamp: "desc" },
          take: 20,
        },
        appointments: {
          orderBy: { date: "asc" },
        },
        medicalNotes: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!cat) {
      return NextResponse.json({ error: "Gatito no encontrado" }, { status: 404 })
    }

    // Process caregiver list
    const caregiversList = cat.caregivers.map((c) => ({
      id: c.user.id,
      name: c.user.name || "Cuidador",
      image: c.user.image,
      role: c.role,
    }))

    // Calculate tasks count in last week for each caregiver
    const activityCounts = await prisma.activityLog.groupBy({
      by: ["userId", "userName"],
      where: {
        catId: id,
        timestamp: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
        },
      },
      _count: {
        id: true,
      },
    })

    const caregiverStats = caregiversList.map((cg) => {
      const match = activityCounts.find((ac) => ac.userId === cg.id)
      return {
        caregiver: cg.name,
        tasksThisWeek: match ? match._count.id : 0,
      }
    })

    const responseData = {
      ...cat,
      caregivers: caregiversList,
      caregiverStats,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error fetching cat details:", error)
    return NextResponse.json({ error: "Error fetching cat details" }, { status: 500 })
  }
}
