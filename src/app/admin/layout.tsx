import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_logged")?.value === "true";

  if (!isAdmin) {
    redirect("/login");
  }

  return <div className="p-6 min-h-screen">{children}</div>;
}
