"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAdmin() {
  (await cookies()).delete("admin_logged");
  redirect("/login");
}
