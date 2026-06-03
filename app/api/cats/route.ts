import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// Generate a random uppercase code like MIAU-XXXX
function generateInviteCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = "MIAU-"
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userCats = await prisma.catCaregiver.findMany({
      where: { userId: session.user.id },
      include: {
        cat: {
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
          },
        },
      },
    })

    // Map to include caregivers flatly for easier frontend parsing
    const cats = userCats.map((uc) => {
      const cat = uc.cat
      return {
        ...cat,
        caregivers: cat.caregivers.map((c) => ({
          id: c.user.id,
          name: c.user.name,
          image: c.user.image,
          role: c.role,
        })),
      }
    })
    
    return NextResponse.json(cats)
  } catch (error) {
    console.error("Error fetching cats:", error)
    return NextResponse.json({ error: "Error fetching cats" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, breed, age, weight } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    let inviteCode = generateInviteCode()
    
    // Ensure uniqueness of invite code
    let exists = await prisma.cat.findUnique({ where: { inviteCode } })
    while (exists) {
      inviteCode = generateInviteCode()
      exists = await prisma.cat.findUnique({ where: { inviteCode } })
    }

    const cat = await prisma.cat.create({
      data: {
        name,
        breed: breed || "Común Europeo",
        age: age || "2 años",
        weight: parseFloat(weight) || 4.2,
        inviteCode,
        caregivers: {
          create: {
            userId: session.user.id,
            role: "owner",
          },
        },
      },
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
      },
    })

    // Seed initial activity log
    await prisma.activityLog.create({
      data: {
        catId: cat.id,
        userId: session.user.id,
        userName: session.user.name || "Cuidador",
        action: "creó al gatito",
      },
    })

    const formattedCat = {
      ...cat,
      caregivers: cat.caregivers.map((c) => ({
        id: c.user.id,
        name: c.user.name,
        image: c.user.image,
        role: c.role,
      })),
    }

    return NextResponse.json(formattedCat)
  } catch (error) {
    console.error("Error creating cat:", error)
    return NextResponse.json({ error: "Error creating cat" }, { status: 500 })
  }
}
