import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    // Βρίσκουμε τον χρήστη με το συγκεκριμένο username
    const user = await prisma.user.findUnique({
      where: { username }
    })
    
    // Αν δεν υπάρχει χρήστης ή το password είναι λάθος
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ error: "Λάθος όνομα χρήστη ή κωδικός πρόσβασης" }, { status: 401 })
    }
    
    // Επιστρέφουμε τα στοιχεία του χρήστη χωρίς το password
    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
    })
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ error: "Προέκυψε σφάλμα κατά τη σύνδεση" }, { status: 500 })
  }
}