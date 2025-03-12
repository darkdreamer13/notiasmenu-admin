import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const category = await prisma.category.findUnique({
      where: { id }
    })
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    
    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()
    
    // Μετατροπή των string σε αριθμούς όπου χρειάζεται
    const categoryData = {
      ...data,
      sort_order: data.sort_order ? Number(data.sort_order) : undefined,
    }
    
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: categoryData
    })
    
    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    
    // Έλεγχος για σχετικά προϊόντα και υποκατηγορίες
    const productsCount = await prisma.product.count({
      where: { category_id: id }
    })
    
    const subcategoriesCount = await prisma.subcategory.count({
      where: { category_id: id }
    })
    
    if (productsCount > 0 || subcategoriesCount > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category with associated products or subcategories",
          hasProducts: productsCount > 0,
          hasSubcategories: subcategoriesCount > 0,
        },
        { status: 400 }
      )
    }
    
    await prisma.category.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}