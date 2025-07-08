import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_logged")?.value === "true";

  if (isAdmin) {
    redirect("/admin");
  }

  return <>{children}</>;
}
