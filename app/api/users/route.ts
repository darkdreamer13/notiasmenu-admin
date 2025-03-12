import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        created_at: true,
        updated_at: true,
      }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Έλεγχος αν υπάρχει ήδη χρήστης με το ίδιο username
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: "Υπάρχει ήδη χρήστης με αυτό το username" }, { status: 400 })
    }
    
    // Κάνουμε hash το password
    const hashedPassword = await hashPassword(data.password)
    
    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: data.role || "user",
      },
      select: {
        id: true,
        username: true,
        role: true,
        created_at: true,
        updated_at: true,
      }
    })
    
    return NextResponse.json(newUser)
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}