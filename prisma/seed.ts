import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialServices = [
  { title: "Компьютерная диагностика ЭСУД", price: 600, categorySlug: "engine" },
  { title: "Замена гидрокомпенсаторов", price: 2100, categorySlug: "engine" },
  { title: "Замена датчика РХХ", price: 350, categorySlug: "engine" },
  { title: "Замена датчика детонации", price: 360, categorySlug: "engine" },
  { title: "Замена масла в двигателе с фильтром", price: 350, categorySlug: "engine" },
  { title: "Регулировка клапанов", price: 750, categorySlug: "engine" },
  { title: "Снятие, установка, ремонт ГБЦ", price: 6000, categorySlug: "engine" },
  { title: "Ремонт ходовой (диагностика)", price: 500, categorySlug: "hodovoy" },
  { title: "Замена амортизатора", price: 1200, categorySlug: "hodovoy" },
];

async function main() {
  console.log("Start seeding...");

  for (const s of initialServices) {
    const cat = await prisma.category.findUnique({ where: { slug: s.categorySlug } });
    const service = await prisma.service.create({
      data: {
        title: s.title,
        price: s.price,
        categoryId: cat?.id ?? null,
      },
    });
    console.log(`Created service with id: ${service.id}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
