# Чеклист перед деплоем — Нива Сервис

## 1. Переменные окружения (.env)

- [ ] Скопировать `.env.example` → `.env`
- [ ] Вставить реальный `RESEND_API_KEY` (получить на <https://resend.com>)
- [ ] Задать рабочий `MANAGER_EMAIL` (почта менеджера для заявок)
- [ ] **Сменить** `ADMIN_USER` и `ADMIN_PASSWORD` (не оставлять дефолтные!)
- [ ] `DATABASE_URL="file:./prod.db"` — путь к файлу SQLite

## 2. HTTPS — HSTS уже включён

HSTS-заголовок активен в `next.config.ts`. Убедитесь что сервер работает за HTTPS (nginx / reverse proxy).

## 3. SEO

- [ ] Поменять `SITE_URL` в `src/app/layout.tsx` на реальный домен
- [ ] Зарегистрировать сайт в [Яндекс Вебмастере](https://webmaster.yandex.ru)
- [ ] Зарегистрировать сайт в [Google Search Console](https://search.google.com/search-console)
- [ ] Создать `public/og-image.jpg` (1200×630px) для шаринга в соцсетях

## 4. Сборка и запуск

```bash
npm install          # установка зависимостей + prisma generate (postinstall)
npm run build        # prisma generate → db push → next build (standalone)
npm start            # запуск продакшен-сервера на порту 3000
```

> **Standalone bundle** (`output: "standalone"`) создаёт минимальный бандл в `.next/standalone/`.
> Можно запускать через `node .next/standalone/server.js` — не нужен полный `node_modules`.

## 5. Запуск через PM2 (рекомендуется)

```bash
npm install -g pm2
pm2 start .next/standalone/server.js --name niva-service
pm2 save
pm2 startup
```

## 6. Проверки после деплоя

- [ ] Открыть сайт — главная, услуги, о нас
- [ ] Отправить тестовую заявку → убедиться что письмо пришло
- [ ] Открыть `/admin` → проверить вход с новым паролем
- [ ] Проверить заголовки безопасности: <https://securityheaders.com>
