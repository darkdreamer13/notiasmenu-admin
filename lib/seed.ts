import { PrismaClient } from '@prisma/client'
import { hashPassword } from './auth'  // Διορθωμένο import
import { store } from './store'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Δημιουργία του admin user
  const adminPassword = await hashPassword('Notias2025!')
  await prisma.user.upsert({
    where: { username: 'menuadmin' },
    update: {},
    create: {
      username: 'menuadmin',
      password: adminPassword,
      role: 'admin',
    },
  })
  console.log('Admin user created')

  // Εισαγωγή κατηγοριών
  for (const category of store.categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name_gr: category.name_gr,
        name_en: category.name_en,
        sort_order: category.sort_order,
        active: category.active,
      },
      create: {
        id: category.id,
        name_gr: category.name_gr,
        name_en: category.name_en,
        sort_order: category.sort_order,
        active: category.active,
      },
    })
  }
  console.log('Categories imported')

  // Εισαγωγή υποκατηγοριών
  for (const subcategory of store.subcategories) {
    await prisma.subcategory.upsert({
      where: { id: subcategory.id },
      update: {
        category_id: subcategory.category_id,
        name_gr: subcategory.name_gr,
        name_en: subcategory.name_en,
        sort_order: subcategory.sort_order,
        active: subcategory.active,
      },
      create: {
        id: subcategory.id,
        category_id: subcategory.category_id,
        name_gr: subcategory.name_gr,
        name_en: subcategory.name_en,
        sort_order: subcategory.sort_order,
        active: subcategory.active,
      },
    })
  }
  console.log('Subcategories imported')

  // Εισαγωγή προϊόντων
  for (const product of store.products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        category_id: product.category_id,
        subcategory_id: product.subcategory_id || null,
        name_gr: product.name_gr,
        name_en: product.name_en,
        description_gr: product.description_gr || null,
        description_en: product.description_en || null,
        price_value: product.price_value,
        price_value2: product.price_value2 || null,
        price_unit: product.price_unit || null,
        winery_gr: product.winery_gr || null,
        winery_en: product.winery_en || null,
        is_frozen: product.is_frozen ? true : false,
        special_order: product.special_order ? true : false,
        sort_order: product.sort_order,
        active: product.active,
      },
      create: {
        id: product.id,
        category_id: product.category_id,
        subcategory_id: product.subcategory_id || null,
        name_gr: product.name_gr,
        name_en: product.name_en,
        description_gr: product.description_gr || null,
        description_en: product.description_en || null,
        price_value: product.price_value,
        price_value2: product.price_value2 || null,
        price_unit: product.price_unit || null,
        winery_gr: product.winery_gr || null,
        winery_en: product.winery_en || null,
        is_frozen: product.is_frozen ? true : false,
        special_order: product.special_order ? true : false,
        sort_order: product.sort_order,
        active: product.active,
      },
    })
  }
  console.log('Products imported')

  // Εισαγωγή ρυθμίσεων
  for (const setting of store.settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: {
        key: setting.key,
        value: setting.value,
      },
    })
  }
  console.log('Settings imported')

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })