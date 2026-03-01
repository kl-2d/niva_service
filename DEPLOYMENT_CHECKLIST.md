# Чеклист перед деплоем — Нива Сервис

## 1. Переменные окружения (.env)
- [ ] Скопировать `.env.example` → `.env`
- [ ] Вставить реальный `RESEND_API_KEY` (получить на https://resend.com)
- [ ] Задать рабочий `MANAGER_EMAIL` (почта менеджера для заявок)
- [ ] **Сменить** `ADMIN_USER` и `ADMIN_PASSWORD` (не оставлять дефолтные!)
- [ ] Для продакшена сменить `DATABASE_URL` на PostgreSQL

## 2. HTTPS — включить HSTS
После установки SSL-сертификата раскомментировать в **`next.config.ts`**:
```ts
// РАСКОММЕНТИРОВАТЬ после установки HTTPS:
{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
```

## 3. SEO
- [ ] Поменять `SITE_URL = "https://niva-service.ru"` в `src/app/layout.tsx` на реальный домен
- [ ] Зарегистрировать сайт в [Яндекс Вебмастере](https://webmaster.yandex.ru)
- [ ] Зарегистрировать сайт в [Google Search Console](https://search.google.com/search-console)
- [ ] Вставить коды верификации в `src/app/layout.tsx` (закомментированные строки)
- [ ] Создать `public/og-image.jpg` (1200×630px) для шаринга в соцсетях

## 4. База данных
- [ ] Выполнить `npx prisma migrate deploy` (применить миграции)
- [ ] Выполнить `npx prisma db seed` (заполнить данными, если нужно)

## 5. Сборка
```bash
npm run build   # проверить что нет ошибок TypeScript
npm start       # запустить продакшен-сервер
```

## 6. Проверки после деплоя
- [ ] Открыть сайт — главная, услуги, о нас
- [ ] Отправить тестовую заявку → убедиться что письмо пришло
- [ ] Открыть `/admin` → проверить вход с новым паролем
- [ ] Проверить заголовки безопасности: https://securityheaders.com
- [ ] Проверить SEO-разметку: https://validator.schema.org
