import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Create the main category
  const categoryStr = "Ремонт ходовой части";
  const categorySlug = "hodovoy";

  let category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: categoryStr,
        slug: categorySlug
      }
    });
    console.log(`Created category: ${category.name}`);
  }

  // 2. Add all services from the HTML document
  const servicesData = [
    { title: "Диагностика ходовой", price: 350 },
    { title: "Замена 2-х пружин передней подвески", price: 1800 },
    { title: "Замена амортизатора перед. подвески", price: 480 },
    { title: "Замена сайлентблоков 4-х рычагов, шт.", price: 3800 },
    { title: "Замена стабилизатора 21213", price: 750 },
    { title: "Замена ступицы, подшипников, торм. диска", price: 1400 },
    { title: "Замена шаровой опоры", price: 380 },
    { title: "Развал - схождение", price: 1100 },
    { title: "Регулировка ступицы", price: 120 },
    { title: "Ремонт снятого привода", price: 850 },
    { title: "Замена амортизатора зад. подвески", price: 300 },
    { title: "Замена промвала", price: 1350 },
    { title: "Замена реакт. штанг ( компл.)", price: 1400 },
    { title: "Замена главного тормозного цилиндра", price: 650 },
    { title: "С/уст. привода 21213", price: 1650 },
    { title: "Замена шлангов ГУРа (3 шт.)", price: 950 },
    { title: "Замена балки заднего моста", price: 4800 },
    { title: "Замена передних тормозных колодок", price: 560 },
    { title: "Замена маятникового рычага", price: 560 },
    { title: "Замена задних тормозных колодок", price: 650 },
    { title: "С/уст. привода 2123", price: 1850 },
    { title: "Замена карданного вала", price: 300 },
    { title: "Замена подшипника и сальника полуоси", price: 850 },
    { title: "Замена 5-ти тормозных шлангов (21213)", price: 1480 },
    { title: "Замена рулевoго механизма", price: 1800 },
    { title: "Замена рабочего торм. цилиндра", price: 520 },
    { title: "Установка защиты \"Шериф\"", price: 250 },
    { title: "Замена крестовины", price: 500 },
    { title: "Замена проставок задних пружин", price: 1200 },
    { title: "Замена блока цилиндров суппорта", price: 1150 },
    { title: "Замена рулевой трапеции", price: 1450 },
  ];

  for (const s of servicesData) {
    const existing = await prisma.service.findFirst({
        where: { title: s.title }
    });
    
    if (!existing) {
        await prisma.service.create({
            data: {
                title: s.title,
                price: s.price,
                categoryId: category.id
            }
        });
        console.log(`Added service: ${s.title}`);
    } else {
        console.log(`Service already exists: ${s.title}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
