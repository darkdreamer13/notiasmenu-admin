cat > "lib/app/api/users/[id]/route.ts" << 'EOF'
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    // Έλεγχος αν το username υπάρχει ήδη σε άλλο χρήστη
    if (data.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: data.username,
          id: { not: id },
        },
      })

      if (existingUser) {
        return NextResponse.json({ error: "Υπάρχει ήδη χρήστης με αυτό το username" }, { status: 400 })
      }
    }

    // Δημιουργία του αντικειμένου δεδομένων για ενημέρωση
    const updateData: Record<string, string | boolean | number> = {}

    if (data.username) updateData.username = data.username
    if (data.role) updateData.role = data.role

    // Αν παρέχεται νέο password, κάνουμε hash
    if (data.password) {
      updateData.password = await hashPassword(data.password)
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Δεν επιτρέπουμε τη διαγραφή του admin με id 1
    if (id === 1) {
      return NextResponse.json({ error: "Δεν επιτρέπεται η διαγραφή του κύριου διαχειριστή" }, { status: 403 })
    }

    // Έλεγχος αν είναι ο τελευταίος admin
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (user?.role === "admin") {
      const adminCount = await prisma.user.count({
        where: { role: "admin" },
      })

      if (adminCount <= 1) {
        return NextResponse.json({ error: "Δεν μπορείτε να διαγράψετε τον τελευταίο διαχειριστή" }, { status: 400 })
      }
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
EOF