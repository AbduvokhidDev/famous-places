const { z } = require("zod");

const optionalText = z.string().nullable().optional();

const imageUrlField = z
  .union([z.string().url("Rasm URL noto'g'ri formatda"), z.literal("")])
  .nullable()
  .optional();

const rateField = z
  .number()
  .min(0, "Reyting 0 dan kam bo'lmasin")
  .max(5, "Reyting 5 dan oshmasin")
  .nullable()
  .optional();

const createPlaceSchema = z.object({
  title: z
    .string()
    .min(2, "Sarlavha kamida 2 ta belgidan iborat bo'lishi kerak"),
  davlat: z.string().min(2, "Iltimos davlat nomini to'liq kiriting"),
  name: optionalText,
  description: optionalText,
  location: optionalText,
  imageUrl: imageUrlField,
  rate: rateField,
  whichLanguage: optionalText,
  kimBilanBorishKerak: optionalText,
});

const updatePlaceSchema = z.object({
  title: z
    .string()
    .min(2, "Sarlavha kamida 2 ta belgidan iborat bo'lishi kerak")
    .optional(),
  davlat: z.string().min(2, "Iltimos davlat nomini to'liq kiriting").optional(),
  name: optionalText,
  description: optionalText,
  location: optionalText,
  imageUrl: imageUrlField,
  rate: rateField,
  whichLanguage: optionalText,
  kimBilanBorishKerak: optionalText,
});

module.exports = { createPlaceSchema, updatePlaceSchema };
