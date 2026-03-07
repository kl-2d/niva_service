# Деплой Niva Service на Beget VPS

**Репозиторий**: <https://github.com/kl-2d/niva_service.git>

## Текущая ситуация

| Параметр | Значение |
|----------|----------|
| Аккаунт | `niva36l9` (Лунак Антон Игоревич) |
| Тариф сейчас | Noble (shared hosting) — **26,96 ₽/день** |
| Домен | `niva36.ru` (A-запись → `87.236.19.243`) |
| SSL | ❌ Не установлен |
| Баланс | 333,18 ₽ |

## Что будет после деплоя

| Параметр | Значение |
|----------|----------|
| Тариф | Cloud VPS — **7 ₽/день** (экономия ~20 ₽/день) |
| Домен | `niva36.ru` → IP нового VPS |
| SSL | ✅ Let's Encrypt (бесплатный, автообновление) |
| Сервер | Ubuntu 24.04, Node.js 20, PM2, Nginx |

---

## Пошаговый план

### Этап 1 — Создание VPS (5 минут)

> [!IMPORTANT]
> Старый сайт продолжит работать, пока мы не переключим DNS. Можно спокойно настраивать.

1. В ЛК Beget → верхнее меню **«Облако»** → **«Виртуальный сервер»** → **«Создать»**
2. Выбрать:
   - **Регион**: Россия, Санкт-Петербург
   - **ОС**: Ubuntu 24.04
   - **Тариф**: 1 vCPU / 1 ГБ RAM / 10 ГБ NVMe — **7 ₽/день**
3. Нажать **«Создать сервер»** — готов через 10 секунд
4. Записать **IP-адрес** и **root-пароль** (придут на почту и покажутся на экране)

---

### Этап 2 — Настройка сервера (я сделаю через SSH)

Подключаемся к VPS по SSH и выполняем:

```bash
# 1. Обновление системы
apt update && apt upgrade -y

# 2. Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Установка PM2 (менеджер процессов)
npm install -g pm2

# 4. Установка Nginx (reverse proxy)
apt install -y nginx

# 5. Установка Certbot (SSL сертификаты)
apt install -y certbot python3-certbot-nginx
```

---

### Этап 3 — Загрузка и запуск проекта

```bash
# 1. Создаём папки
mkdir -p /var/www/niva-service
mkdir -p /var/log/niva-service
mkdir -p /var/backups
cd /var/www/niva-service

# 2. Копируем файлы с компьютера на сервер (выполняем на ВАШЕМ ПК):
# scp -r .next/standalone/* root@<IP_VPS>:/var/www/niva-service/
# scp -r .next/static .next/standalone/.next/static  
# scp -r public root@<IP_VPS>:/var/www/niva-service/public
# scp prisma/dev.db root@<IP_VPS>:/var/www/niva-service/prisma/prod.db
# scp .env root@<IP_VPS>:/var/www/niva-service/.env
# scp ecosystem.config.js root@<IP_VPS>:/var/www/niva-service/

# 3. На сервере: отредактировать .env
nano /var/www/niva-service/.env
# Поменять DATABASE_URL="file:./prisma/prod.db"

# 4. Запуск через PM2 (ecosystem config)
cd /var/www/niva-service
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # автозапуск при перезагрузке сервера
```

---

### Этап 4 — Настройка Nginx

```nginx
# /etc/nginx/sites-available/niva36.ru

# Redirect www → non-www
server {
    listen 80;
    server_name www.niva36.ru;
    return 301 https://niva36.ru$request_uri;
}

server {
    listen 80;
    server_name niva36.ru;

    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 30;
        proxy_read_timeout 60;
        proxy_send_timeout 30;
    }
}
```

```bash
# Активация конфигурации
ln -s /etc/nginx/sites-available/niva36.ru /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

### Этап 5 — Переключение домена (момент переезда)

> [!CAUTION]
> После этого шага старый сайт перестанет работать, а новый начнёт. DNS обновляется от 5 минут до 2 часов.

1. В ЛК Beget → **«DNS»** → выбрать `niva36.ru`
2. Раскрыть запись **A**
3. Заменить IP `87.236.19.243` → **IP нового VPS**
4. Нажать **«Сохранить»**

---

### Этап 6 — SSL-сертификат (после переключения DNS)

```bash
# На VPS, когда домен уже указывает на новый IP:
certbot --nginx -d niva36.ru -d www.niva36.ru
# Вводим email, соглашаемся с условиями — готово!

# Автообновление (каждые 2 месяца автоматически):
certbot renew --dry-run  # проверка
```

---

### Этап 7 — Верификация домена в Resend (для email-рассылки)

> [!IMPORTANT]
> Без этого шага email-уведомления **не будут приходить** на внешние адреса.

1. Войти в [Resend Dashboard](https://resend.com/domains) → **Domains** → **Add Domain**
2. Ввести `niva36.ru`
3. Добавить **DNS-записи** (MX, TXT/SPF, DKIM) в ЛК Beget → DNS → niva36.ru
4. Дождаться верификации (5–30 мин)
5. Проверить отправку тестового письма на `niva36@mail.ru`

---

### Этап 8 — Отключение старого хостинга (экономия)

> [!WARNING]
> Делать только после того, как убедились что новый сайт работает нормально (дать 1-2 дня).

1. ЛК Beget → **«Управление услугами»**
2. **Отключить** тариф Noble (26,96 ₽/день)
3. Домен `niva36.ru` останется — он привязан к аккаунту, а не к тарифу

**Итоговая стоимость**: ~210 ₽/мес вместо ~810 ₽/мес

---

### Этап 9 — Бэкапы БД (после запуска)

```bash
# Cron: ежедневный бэкап в 3:00
echo '0 3 * * * root cp /var/www/niva-service/prisma/prod.db /var/backups/niva-$(date +\%F).db' > /etc/cron.d/niva-backup

# Удаление бэкапов старше 30 дней
echo '0 4 * * 0 root find /var/backups -name "niva-*.db" -mtime +30 -delete' >> /etc/cron.d/niva-backup
```

---

## Чеклист перед деплоем

- [x] `npm run build` проходит без ошибок
- [x] Секреты в `.env` обновлены (ADMIN_PASSWORD, SECRET_KEY, RECOVERY_TOKEN)
- [x] Кастомные 404/500 страницы ошибок созданы
- [x] PM2 `ecosystem.config.js` создан
- [x] Resend `from:` обновлён на `info@niva36.ru`
- [x] Домен обновлён на `niva36.ru` везде
- [x] `.env.example` дополнен (RECOVERY_TOKEN)
- [ ] Удалить тестовый отзыв «тест чепуха отзыв»
- [ ] Получить от заказчика правки по копирайту

## При деплое

- [ ] Создать VPS (Ubuntu 24.04, 1 vCPU / 1 ГБ RAM)
- [ ] Установить Node.js 20, PM2, Nginx, Certbot
- [ ] Скопировать standalone build, public, prisma/prod.db, .env, ecosystem.config.js
- [ ] Поменять DATABASE_URL на серверный путь в .env
- [ ] Настроить Nginx с таймаутами и www-редиректом
- [ ] Переключить DNS A-запись на IP VPS
- [ ] Получить SSL через certbot
- [ ] Верифицировать niva36.ru в Resend (DNS-записи)
- [ ] Настроить cron-бэкап БД
- [ ] Проверить сайт, формы, email-уведомления
- [ ] Отключить старый хостинг (через 1-2 дня)

## Что мне нужно от тебя

1. **Создай VPS** в ЛК Beget (Облако → Создать сервер → Ubuntu 24.04 → минимальный тариф)
2. **Скинь мне IP и пароль** — дальше я всё настрою через SSH

---

## Договорённости

- **Я** настрою весь прод через терминал (SSH) и браузер (ЛК Beget)
- **Ты** только подтверждаешь команды и вводишь пароли
- Деплой начинаем **после получения финальных правок от заказчика**

## Ожидаем от заказчика

- [ ] Правки по копирайту (тексты на сайте)
- [ ] Решение по блоку «О нас» (фото/видео мастерской)
- [ ] Пополнение баланса Beget (если нужно)
