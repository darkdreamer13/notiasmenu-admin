import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sort_order: 'asc' }
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Μετατροπή των string σε αριθμούς όπου χρειάζεται
    const categoryData = {
      ...data,
      sort_order: Number(data.sort_order),
    }
    
    const newCategory = await prisma.category.create({
      data: categoryData
    })
    
    return NextResponse.json(newCategory)
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}