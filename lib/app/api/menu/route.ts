cat > "lib/app/api/menu/route.ts" << 'EOF'
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get("lang") || "gr"

  try {
    // Φορτώνουμε όλα τα δεδομένα από τη βάση
    const [categories, subcategories, products, settingsArray] = await Promise.all([
      prisma.category.findMany({
        where: { active: true },
        orderBy: { sort_order: "asc" },
      }),
      prisma.subcategory.findMany({
        where: { active: true },
        orderBy: { sort_order: "asc" },
      }),
      prisma.product.findMany({
        where: { active: true },
        orderBy: { sort_order: "asc" },
      }),
      prisma.setting.findMany(),
    ])

    // Μετατροπή των ρυθμίσεων σε αντικείμενο
    const settings = settingsArray.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      },
      {} as Record<string, string>,
    )

    // Επιστρέφουμε τα δεδομένα
    return NextResponse.json(
      {
        categories,
        subcategories,
        products,
        settings,
        lang,
        api_source: "prisma",
        last_updated: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("Error in menu API:", error)

    // Σε περίπτωση σφάλματος, επιστρέφουμε το σφάλμα
    return NextResponse.json(
      {
        error: String(error),
        message: "Error occurred while fetching menu data.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}
EOF