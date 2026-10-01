const { z } = require("zod");

const createPlaceSchema = z.object({
  title: z
    .string()
    .min(2, "Sarlavha kamida 2 ta belgidan iborat bo'lishi kerak"),
  description: z.string().optional(),
  imageUrl: z
    .union([z.string().url("Rasm URL noto'g'ri formatda"), z.literal("")])
    .optional(),

  rate: z.number().int().min(1).max(5).optional().nullable(),
  davlat: z.string().min(2, "Iltimos davlat nomini to'liq kiriting"),
});

const updatePlaceSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  imageUrl: z
    .union([z.string().url("Rasm URL noto'g'ri formatda"), z.literal("")])
    .optional(),

  rate: z.number().int().min(1).max(5).optional().nullable(),
  davlat: z.string().min(2).optional(),
});

module.exports = {
  createPlaceSchema: createPlaceSchema,
  updatePlaceSchema: updatePlaceSchema,
};
