import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialServices = [
  { title: "Компьютерная диагностика ЭСУД", price: 600, category: "engine" },
  { title: "Замена гидрокомпенсаторов", price: 2100, category: "engine" },
  { title: "Замена датчика РХХ", price: 350, category: "engine" },
  { title: "Замена датчика детонации", price: 360, category: "engine" },
  { title: "Замена масла в двигателе с фильтром", price: 350, category: "engine" },
  { title: "Регулировка клапанов", price: 750, category: "engine" },
  { title: "Снятие, установка, ремонт ГБЦ", price: 6000, category: "engine" },
  { title: "Ремонт ходовой (диагностика)", price: 500, category: "suspension" },
  { title: "Замена амортизатора", price: 1200, category: "suspension" },
];

async function main() {
  console.log("Start seeding...");

  for (const s of initialServices) {
    const service = await prisma.service.create({
      data: s,
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
