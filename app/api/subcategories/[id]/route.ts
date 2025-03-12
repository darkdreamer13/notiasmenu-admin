import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(context.params.id)
    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
    })

    if (!subcategory) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 })
    }

    return NextResponse.json(subcategory)
  } catch (error) {
    console.error("Error fetching subcategory:", error)
    return NextResponse.json({ error: "Failed to fetch subcategory" }, { status: 500 })
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
    const subcategoryData = {
      ...data,
      category_id: data.category_id ? Number(data.category_id) : undefined,
      sort_order: data.sort_order ? Number(data.sort_order) : undefined,
    }

    const updatedSubcategory = await prisma.subcategory.update({
      where: { id },
      data: subcategoryData,
    })

    return NextResponse.json(updatedSubcategory)
  } catch (error) {
    console.error("Error updating subcategory:", error)
    return NextResponse.json({ error: "Failed to update subcategory" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(context.params.id)

    // Έλεγχος για σχετικά προϊόντα
    const productsCount = await prisma.product.count({
      where: { subcategory_id: id },
    })

    if (productsCount > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete subcategory with associated products",
          hasProducts: true,
        },
        { status: 400 },
      )
    }

    await prisma.subcategory.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting subcategory:", error)
    return NextResponse.json({ error: "Failed to delete subcategory" }, { status: 500 })
  }
}
