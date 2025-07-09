import z from "zod";
import path from "path";

export const appSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "O nome do aplicativo é obrigatório."),
  description: z.string().min(1, "A descrição do aplicativo é obrigatória."),
  url: z
    .string()
    .url("URL inválida.")
    .min(1, "A URL do aplicativo é obrigatória."),
  icon: z
    .string()
    // .url("URL do ícone inválida.")
    .min(1, "O ícone é obrigatório."),
  category: z.string().min(1, "A categoria do aplicativo é obrigatória."),
  color: z.string().min(1, "A cor do aplicativo é obrigatória."),
});

export const appsFilePath = path.join(
  process.cwd(),
  "src",
  "data",
  "apps.json"
);

export const appImagesDir = path.join(
  process.cwd(),
  "public",
  "assets",
  "apps-images"
);
