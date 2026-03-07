---
trigger: always_on
---

---

description: Apply whenever dealing with the database, Prisma schema, or data fetching.
glob: "prisma/schema.prisma, src/app/api/**/*.ts, src/lib/prisma.ts"
---

# Database Workflow (Prisma & SQLite)

- The project uses **SQLite** as the database, managed by **Prisma ORM**.
- All database queries must be executed using the Prisma Client instance (imported from `import { prisma } from "@/lib/prisma";`).
- **Schema Changes:** If modifying `prisma/schema.prisma`, immediately remind the user to run `npx prisma db push` or `npx prisma migrate dev` in their PowerShell terminal.
- **Data relations:** Remember SQLite limitations regarding certain complex relations compared to PostgreSQL. Keep queries optimized and handle potential missing data gracefully.
