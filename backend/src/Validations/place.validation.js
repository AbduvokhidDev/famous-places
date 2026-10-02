const { z } = require("zod");

const imageUrlField = z
  .union([z.string().url("Rasm URL noto'g'ri formatda"), z.literal("")])
  .optional();

const createPlaceSchema = z.object({
  title: z
    .string()
    .min(2, "Sarlavha kamida 2 ta belgidan iborat bo'lishi kerak"),
  davlat: z.string().min(2, "Iltimos davlat nomini to'liq kiriting"),
  name: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  imageUrl: imageUrlField,
  rate: z.number().int().min(1).max(5).optional().nullable(),
  whichLanguage: z.string().optional(),
  kimBilanBorishKerak: z.string().optional(),
});

const updatePlaceSchema = z.object({
  title: z.string().min(2).optional(),
  davlat: z.string().min(2).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  imageUrl: imageUrlField,
  rate: z.number().int().min(1).max(5).optional().nullable(),
  whichLanguage: z.string().optional(),
  kimBilanBorishKerak: z.string().optional(),
});

module.exports = { createPlaceSchema, updatePlaceSchema };
