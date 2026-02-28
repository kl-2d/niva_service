import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const categorySlug = "engine";
  const categoryStr = "Ремонт двигателя";

  let category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });

  if (!category) {
    category = await prisma.category.create({
      data: { name: categoryStr, slug: categorySlug }
    });
    console.log(`Created category: ${category.name}`);
  }

  const servicesData = [
    // Столбец 1 (строки 1-11)
    { title: "Диагностика ЭСУД", price: 600 },
    { title: "Замена гидрокомпенсаторов", price: 2100 },
    { title: "Замена гидрокомпенсаторов на болты рычагов клапанов", price: 1500 },
    { title: "Замена датчика РХХ", price: 360 },
    { title: "Замена датчика детонации", price: 350 },
    { title: "Замена датчика кислорода (лямбда зонда)", price: 360 },
    { title: "Замена масла в двигателе", price: 250 },
    { title: "Замена маслосъемных колпачков", price: 2500 },
    { title: "Замена ремня привода агрегатов и 2-х роликов (а/м без кондиционера)", price: 800 },
    { title: "Замена топливного фильтра 21214", price: 280 },
    { title: "Замена топливного фильтра 2123", price: 380 },
    // Столбец 2 (строки 12-22)
    { title: "Замена успокоителя цепи", price: 450 },
    { title: "Замена форсунок и жгута форсунок", price: 1500 },
    { title: "Замена цепи и звездочек ГРМ ДВС", price: 2500 },
    { title: "Измерение компрессии двигателя", price: 300 },
    { title: "Промывка форсунок", price: 1300 },
    { title: "Регулировка клапанов", price: 700 },
    { title: "Снятие, уст., ремонт ГБЦ (21213, 21214, 2123)", price: 6000 },
    { title: "Фрезеровка ГБЦ", price: 3500 },
    { title: "Чип-тюнинг", price: 1300 },
    { title: "Чистка блока дросселя", price: 460 },
    { title: "Замена крана отопителя", price: 750 },
    // Столбец 3 (строки 23-33)
    { title: "Замена осн. радиатора 21213", price: 850 },
    { title: "Замена осн. радиатора 2123", price: 1600 },
    { title: "Замена осн. радиатора 2123 Bertone (без кондиционера)", price: 2500 },
    { title: "Замена охлаждающей жидкости", price: 350 },
    { title: "Замена патрубков системы охлаждения 21213 (компл.)", price: 1200 },
    { title: "Замена патрубков системы охлаждения 2123 (компл.)", price: 2300 },
    { title: "Замена радиатора отопителя салона 21213", price: 1150 },
    { title: "Замена радиатора отопителя салона 2123 (без кондиц.)", price: 2150 },
    { title: "Замена радиатора отопителя салона 2123 (с кондиц.)", price: 4350 },
    { title: "Замена термостата", price: 350 },
    { title: "Промывка системы охлаждения", price: 750 },
  ];

  for (const s of servicesData) {
    const existing = await prisma.service.findFirst({
      where: { title: s.title, categoryId: category.id }
    });
    if (!existing) {
      await prisma.service.create({
        data: { title: s.title, price: s.price, categoryId: category.id }
      });
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
