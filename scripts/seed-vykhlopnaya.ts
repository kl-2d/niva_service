import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const categorySlug = "exhaust";
  const categoryStr = "Выхлопная система";

  let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    category = await prisma.category.create({ data: { name: categoryStr, slug: categorySlug } });
    console.log(`Created category: ${category.name}`);
  }

  const servicesData = [
    { title: "Замена основного глушителя", price: 480 },
    { title: "Замена прокладки коллектора (впуск-выпуск)", price: 2500 },
    { title: "Замена прокладки приемной трубы", price: 700 },
    { title: "Замена резонатора", price: 850 },
    { title: "Удаление содержимого катализатора", price: 600 },
    { title: "Установка доп. глушителя вместо катализатора", price: 1800 },
    { title: "Изготовление и монтаж выхлопной системы для а/м с газ. оборудованием", price: 1800 },
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
