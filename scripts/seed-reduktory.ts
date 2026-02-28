import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const categorySlug = "reduktory";
  const categoryStr = "Редукторы";

  let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    category = await prisma.category.create({ data: { name: categoryStr, slug: categorySlug } });
    console.log(`Created category: ${category.name}`);
  }

  const servicesData = [
    { title: "Замена масла в редукторе переднего моста", price: 250 },
    { title: "Замена сальника редуктора переднего моста", price: 380 },
    { title: "Ремонт редуктора переднего моста (узел снят)", price: 2000 },
    { title: "Снятие, уст. редуктора перед. моста 2123", price: 3600 },
    { title: "Снятие, уст. редуктора перед. моста 21213", price: 3200 },
    { title: "Замена масла в редукторе заднего моста", price: 250 },
    { title: "Замена сальника редуктора зад. моста", price: 380 },
    { title: "Ремонт редуктора заднего моста", price: 2000 },
    { title: "Снятие, уст. редуктора зад. моста", price: 1800 },
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
