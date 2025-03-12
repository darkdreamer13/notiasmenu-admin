import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { sort_order: 'asc' }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Μετατροπή των string σε αριθμούς όπου χρειάζεται
    const productData = {
      ...data,
      category_id: Number(data.category_id),
      subcategory_id: data.subcategory_id ? Number(data.subcategory_id) : null,
      price_value: Number(data.price_value),
      price_value2: data.price_value2 ? Number(data.price_value2) : null,
      sort_order: Number(data.sort_order),
    }
    
    const newProduct = await prisma.product.create({
      data: productData
    })
    
    return NextResponse.json(newProduct)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}