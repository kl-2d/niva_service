import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const categorySlug = "electrics";
  const categoryStr = "Электрика";

  let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    category = await prisma.category.create({ data: { name: categoryStr, slug: categorySlug } });
    console.log(`Created category: ${category.name}`);
  }

  const servicesData = [
    { title: "Замена замка зажигания 2123", price: 1200 },
    { title: "Замена контроллера", price: 300 },
    { title: "Замена лампы ближнего света 21213", price: 240 },
    { title: "Замена лампы габарита", price: 60 },
    { title: "Замена модуля зажигания", price: 300 },
    { title: "Замена переключателя поворотов", price: 380 },
    { title: "Замена свечей", price: 300 },
    { title: "Замена стартера 2123 (без кондиционера)", price: 800 },
    { title: "Замена эл.бензонасоса 2123", price: 1150 },
    { title: "Замена эл.вентиляторов сист. охлаждения 21214", price: 1360 },
    { title: "Снятие, уст. генератора; замена диодн. моста, реле-регулятора", price: 1250 },
    { title: "Снятие, уст. стартера, замена втягив. реле и бендикса, смазка редуктора и втулок", price: 1350 },
    { title: "Установка и подключение противотуманных фар (ПТФ)", price: 1350 },
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
