import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Formato de email inválido."), // Adicionado validação de formato de email
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
});
