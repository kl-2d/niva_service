import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const categorySlug = "razdatka";
  const categoryStr = "Ремонт раздатки";

  let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    category = await prisma.category.create({ data: { name: categoryStr, slug: categorySlug } });
    console.log(`Created category: ${category.name}`);
  }

  const servicesData = [
    { title: "Замена масла в раздаточной коробке", price: 250 },
    { title: "Замена сальника раздаточной коробки (перед. нижнего)", price: 380 },
    { title: "Ремонт раздаточной коробки (узел снят)", price: 2300 },
    { title: "Снятие, установка раздаточной коробки", price: 1350 },
    { title: "Центровка раздаточной коробки", price: 250 },
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
