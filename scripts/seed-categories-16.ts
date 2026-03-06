import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const CATEGORIES = [
    { name: "Передняя подвеска", slug: "perednyaya-podveska" },
    { name: "Задняя подвеска", slug: "zadnyaya-podveska" },
    { name: "Рулевое управление", slug: "rulevoe" },
    { name: "Карданная передача", slug: "kardannaya" },
    { name: "Сцепление", slug: "stseplenie" },
    { name: "КПП", slug: "kpp" },
    { name: "Раздатка", slug: "razdatka" },
    { name: "Передний мост", slug: "peredniy-most" },
    { name: "Задний мост", slug: "zadniy-most" },
    { name: "Тормозная система", slug: "tormoza" },
    { name: "Система охлаждения", slug: "ohlazhdenie" },
    { name: "Система выпуска", slug: "vypusk" },
    { name: "Двигатель", slug: "dvigatel" },
    { name: "Электрооборудование", slug: "electro" },
    { name: "Кузов и салон", slug: "kuzov" },
    { name: "Модернизация", slug: "modernizatsiya" },
];

async function main() {
    for (const cat of CATEGORIES) {
        const existing = await prisma.category.findUnique({
            where: { slug: cat.slug }
        });

        if (!existing) {
            await prisma.category.create({ data: cat });
            console.log(`✅ Создана категория: ${cat.name} (${cat.slug})`);
        } else {
            console.log(`⏭️  Категория уже существует: ${cat.name}`);
        }
    }

    console.log('\n🎉 Сидирование категорий завершено!');
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
