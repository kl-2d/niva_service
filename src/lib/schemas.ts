import { z } from "zod";

// ── Booking (checkout form) ──────────────────────────────────────────────────
export const bookingSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя слишком длинное")
    .regex(/^[а-яёА-ЯЁa-zA-Z\s\-'.]+$/, "Имя содержит недопустимые символы"),
  phone: z
    .string()
    .min(6, "Телефон слишком короткий")
    .max(20, "Телефон слишком длинный")
    .regex(/^[\d\s\+\-\(\)]+$/, "Некорректный формат телефона"),
  date: z.string().optional().nullable(),
  services: z
    .array(
      z.object({
        title: z.string().min(1).max(300),
        price: z.number().min(0).max(10_000_000),
      })
    )
    .min(1, "Выберите хотя бы одну услугу")
    .max(50, "Слишком много услуг"),
  totalPrice: z.number().min(0).max(100_000_000),
  carBrand: z.string().max(100).optional().nullable(),
  carPlate: z.string().max(20).optional().nullable(),
});

// ── Callback (request call modal) ────────────────────────────────────────────
export const callbackSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя слишком длинное")
    .regex(/^[а-яёА-ЯЁa-zA-Z\s\-'.]+$/, "Имя содержит недопустимые символы"),
  phone: z
    .string()
    .min(6, "Телефон слишком короткий")
    .max(20, "Телефон слишком длинный")
    .regex(/^[\d\s\+\-\(\)]+$/, "Некорректный формат телефона"),
  carBrand: z.string().max(100).optional().nullable(),
  carPlate: z.string().max(20).optional().nullable(),
});

// ── Service (admin CRUD) ──────────────────────────────────────────────────────
export const serviceSchema = z.object({
  title: z
    .string()
    .min(2, "Название должно содержать минимум 2 символа")
    .max(300, "Название слишком длинное"),
  price: z
    .union([z.number(), z.string()])
    .transform((v) => Number(v))
    .pipe(z.number().min(0, "Цена не может быть отрицательной").max(10_000_000)),
  categoryId: z.number().int().positive().optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type CallbackInput = z.infer<typeof callbackSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
