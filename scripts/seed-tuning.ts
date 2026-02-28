import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const categorySlug = "tuning";
  const categoryStr = "Тюнинг";

  let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    category = await prisma.category.create({ data: { name: categoryStr, slug: categorySlug } });
    console.log(`Created category: ${category.name}`);
  }

  const servicesData = [
    { title: "Изготовление и установка подрамника раздаточной коробки 21213", price: 8500 },
    { title: "Лифт кузова", price: 10500 }, // диапазон 10500–15000, указана минимальная цена
    { title: "Перенос крепления генератора (верхнее расположение)", price: 6500 },
    { title: "Модернизация подвески редуктора переднего моста независимо от двигателя", price: 7500 },
    { title: "Снятие, уст. редуктора заднего моста; установка самоблокирующегося дифференциала", price: 3800 },
    { title: "Установка ГУР", price: 6500 },
    { title: "Установка комплекта нерегулируемых ступиц", price: 3600 },
    { title: "Установка фаркопа, подключение", price: 1400 },
    { title: "Установка шноркеля 21213", price: 3500 },
    { title: "Чип-тюнинг", price: 3500 },
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
