import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(context.params.id)
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(context.params.id)
    const data = await request.json()

    // Μετατροπή των string σε αριθμούς όπου χρειάζεται
    const productData = {
      ...data,
      category_id: data.category_id ? Number(data.category_id) : undefined,
      subcategory_id: data.subcategory_id ? Number(data.subcategory_id) : null,
      price_value: data.price_value ? Number(data.price_value) : undefined,
      price_value2: data.price_value2 ? Number(data.price_value2) : null,
      sort_order: data.sort_order ? Number(data.sort_order) : undefined,
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productData,
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(context.params.id)

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
