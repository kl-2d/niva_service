import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const categorySlug = "kpp";
  const categoryStr = "Ремонт КПП";

  let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    category = await prisma.category.create({ data: { name: categoryStr, slug: categorySlug } });
    console.log(`Created category: ${category.name}`);
  }

  const servicesData = [
    { title: "Замена главного цилиндра сцепления", price: 550 },
    { title: "Замена рабочего цилиндра сцепления", price: 450 },
    { title: "Замена сцепления (при снятой КПП)", price: 150 },
    { title: "Замена тормозной жидкости в системе привода сцепления", price: 240 },
    { title: "Замена масла в КПП", price: 250 },
    { title: "Проверка уровня масла в КПП", price: 80 },
    { title: "Ремонт КПП (снятой)", price: 2000 },
    { title: "Снятие, установка КПП", price: 2950 },
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
