"use server";

import { cookies } from "next/headers";

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies();
    cookieStore.set("admin_logged", "true", {
      httpOnly: true,
      // secure: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return { success: true };
  }

  return { success: false, message: "Credenciais inválidas" };
}
