import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    
    type: z.enum([
      "curso-gratis",
      "curso-pago",
      "livro",
      "livro-programacao",
      "projeto",
      "tutorial",
      "bobajada",
    ]),

    label: z.enum([
      "Curso",
      "Livro",
      "Projeto",
      "Tutorial",
      "Bobajada",
    ]),

    image: z.string(),
  }),
});

export const collections = { blog };
