import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 * Миграция услуг из старых 9 категорий в новые 16.
 * Маппинг по ключевым словам в названии услуги.
 */

// New category slugs for reference
const NEW_SLUGS = {
    PEREDNYAYA: 'perednyaya-podveska',
    ZADNYAYA: 'zadnyaya-podveska',
    RULEVOE: 'rulevoe',
    KARDANNAYA: 'kardannaya',
    STSEPLENIE: 'stseplenie',
    KPP: 'kpp',
    RAZDATKA: 'razdatka',
    PEREDNIY_MOST: 'peredniy-most',
    ZADNIY_MOST: 'zadniy-most',
    TORMOZA: 'tormoza',
    OHLAZHDENIE: 'ohlazhdenie',
    VYPUSK: 'vypusk',
    DVIGATEL: 'dvigatel',
    ELECTRO: 'electro',
    KUZOV: 'kuzov',
    MODERNIZATSIYA: 'modernizatsiya',
} as const

// Keywords → new category slug
const KEYWORD_MAP: [RegExp, string][] = [
    // Передняя подвеска
    [/перед.*подвеск|пружин.*перед|амортизатор.*перед|сайлентблок|стабилизатор|ступиц|шаровой|привод.*21213|привод.*2123|развал|схожден/i, NEW_SLUGS.PEREDNYAYA],
    // Задняя подвеска
    [/зад.*подвеск|амортизатор.*зад|реакт.*штанг|проставок.*зад|пружин.*зад/i, NEW_SLUGS.ZADNYAYA],
    // Рулевое
    [/рулев|маятник|ГУР|гур|трапец/i, NEW_SLUGS.RULEVOE],
    // Карданная передача
    [/кардан|крестовин|промвал/i, NEW_SLUGS.KARDANNAYA],
    // Тормозная система
    [/тормоз|суппорт|торм\.|колодк/i, NEW_SLUGS.TORMOZA],
    // Сцепление
    [/сцеплен/i, NEW_SLUGS.STSEPLENIE],
    // КПП
    [/КПП|кпп|коробк.*передач/i, NEW_SLUGS.KPP],
    // Раздатка
    [/раздат/i, NEW_SLUGS.RAZDATKA],
    // Передний мост
    [/перед.*мост|редуктор.*перед/i, NEW_SLUGS.PEREDNIY_MOST],
    // Задний мост
    [/зад.*мост|полуос|редуктор.*зад/i, NEW_SLUGS.ZADNIY_MOST],
    // Система охлаждения
    [/охлажд|радиатор|патрубк|термостат|помп|антифриз|тосол|вентилятор.*сист/i, NEW_SLUGS.OHLAZHDENIE],
    // Система выпуска
    [/глушител|выхлоп|резонатор|катализатор|коллектор|приемн.*труб/i, NEW_SLUGS.VYPUSK],
    // Электрооборудование
    [/электр|генератор|стартер|свеч|зажиган|лампа?|фар|бензонасос|контроллер|модуль зажиг|диодн|бендикс|ПТФ|поворот/i, NEW_SLUGS.ELECTRO],
    // Модернизация
    [/тюнинг|лифт|подрамник|фаркоп|шноркель|самоблок|нерегулир.*ступиц|модерниз|чип-тюнинг/i, NEW_SLUGS.MODERNIZATSIYA],
    // Двигатель (catch-all for engine services)
    [/двигател|ГРМ|цепи|клапан|ГБЦ|форсунк|дроссел|компресс|поршн|ремня.*привод|топливн|масло.*двигат|капитальн/i, NEW_SLUGS.DVIGATEL],
]

// Fallback mapping: old slug → new slug (if no keyword matches)
const FALLBACK_MAP: Record<string, string> = {
    hodovoy: NEW_SLUGS.PEREDNYAYA,
    engine: NEW_SLUGS.DVIGATEL,
    kpp: NEW_SLUGS.KPP,
    razdatka: NEW_SLUGS.RAZDATKA,
    reduktory: NEW_SLUGS.PEREDNIY_MOST,
    vykhlopnaya: NEW_SLUGS.VYPUSK,
    tuning: NEW_SLUGS.MODERNIZATSIYA,
    rasval: NEW_SLUGS.PEREDNYAYA,
    electrics: NEW_SLUGS.ELECTRO,
}

function findNewSlug(title: string, oldSlug: string): string {
    for (const [regex, newSlug] of KEYWORD_MAP) {
        if (regex.test(title)) return newSlug
    }
    return FALLBACK_MAP[oldSlug] ?? NEW_SLUGS.DVIGATEL
}

async function main() {
    // Load new categories (slug → id)
    const newCats = await prisma.category.findMany()
    const slugToId = new Map(newCats.map(c => [c.slug, c.id]))

    // Old category slugs
    const oldSlugs = Object.keys(FALLBACK_MAP)
    const oldCats = newCats.filter(c => oldSlugs.includes(c.slug))

    let migrated = 0
    let skipped = 0

    for (const oldCat of oldCats) {
        const services = await prisma.service.findMany({
            where: { categoryId: oldCat.id },
        })

        for (const svc of services) {
            const newSlug = findNewSlug(svc.title, oldCat.slug)
            const newCatId = slugToId.get(newSlug)

            if (!newCatId) {
                console.log(`⚠️  Не найдена категория: ${newSlug} для "${svc.title}"`)
                skipped++
                continue
            }

            // Skip if already in the right category
            if (svc.categoryId === newCatId) {
                console.log(`⏭️  Уже верно: "${svc.title}" → ${newSlug}`)
                continue
            }

            await prisma.service.update({
                where: { id: svc.id },
                data: { categoryId: newCatId },
            })
            console.log(`✅ "${svc.title}" → ${newSlug}`)
            migrated++
        }
    }

    console.log(`\n🎉 Миграция завершена: ${migrated} перемещено, ${skipped} пропущено`)

    // Delete old categories (now empty)
    for (const oldCat of oldCats) {
        const remaining = await prisma.service.count({ where: { categoryId: oldCat.id } })
        if (remaining === 0) {
            // Only delete if slug is truly old (not shared with new categories like kpp/razdatka)
            const isNewSlug = ['kpp', 'razdatka'].includes(oldCat.slug)
            if (!isNewSlug) {
                await prisma.category.delete({ where: { id: oldCat.id } })
                console.log(`🗑️  Удалена старая категория: ${oldCat.name} (${oldCat.slug})`)
            }
        } else {
            console.log(`⚠️  Категория "${oldCat.name}" ещё содержит ${remaining} услуг — не удалена`)
        }
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1) })
