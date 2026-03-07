import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Нива Сервис — Ремонт Нивы в Воронеже",
        short_name: "Нива Сервис",
        description:
            "Специализированный автосервис в Воронеже по ремонту автомобилей семейства НИВА. Ходовая, двигатель, КПП, раздатка, редукторы, тюнинг.",
        start_url: "/",
        display: "standalone",
        background_color: "#F0EDE8",
        theme_color: "#1C1F23",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
            {
                src: "/og-image.jpg",
                sizes: "1200x630",
                type: "image/jpeg",
                purpose: "any",
            },
        ],
        lang: "ru",
        categories: ["auto", "automotive"],
    };
}
