import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const subcategories = await prisma.subcategory.findMany({
      orderBy: { id: "asc" },
      include: { category: true },
    })
    return NextResponse.json(subcategories)
  } catch (error) {
    console.error("Error fetching subcategories:", error)
    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name_gr, name_en, category_id } = body

    if (!name_gr || !name_en || !category_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        name_gr,
        name_en,
        category_id: Number(category_id),
      },
    })

    return NextResponse.json(subcategory, { status: 201 })
  } catch (error) {
    console.error("Error creating subcategory:", error)
    return NextResponse.json(
      { error: "Failed to create subcategory" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
