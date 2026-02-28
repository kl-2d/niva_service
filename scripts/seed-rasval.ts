import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const categorySlug = "rasval";
  const categoryStr = "Развал-схождение";

  let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    category = await prisma.category.create({ data: { name: categoryStr, slug: categorySlug } });
    console.log(`Created category: ${category.name}`);
  }

  const servicesData = [
    { title: "Компьютерный развал-схождение 21213, 21214, 2123", price: 1100 },
  ];

  for (const s of servicesData) {
    const existing = await prisma.service.findFirst({ where: { title: s.title, categoryId: category.id } });
    if (!existing) {
      await prisma.service.create({ data: { title: s.title, price: s.price, categoryId: category.id } });
      console.log(`Added: ${s.title} — ${s.price} ₽`);
    } else {
      console.log(`Exists: ${s.title}`);
    }
  }
  console.log('Done!');
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
