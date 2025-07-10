import { Toaster } from "sonner";
import { AddEditAppDialog } from "./_components/add-edit-app-dialog";
import { columns, App } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import AdminHeader from "./_components/header";
import { promises as fs } from "fs";
import path from "path";

const appsFilePath = path.join(process.cwd(), "src", "data", "apps.json");

async function getData(): Promise<App[]> {
  try {
    const fileContent = await fs.readFile(appsFilePath, "utf-8");
    const apps: App[] = JSON.parse(fileContent);
    return apps;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "ENOENT"
    ) {
      console.warn("Arquivo apps.json não encontrado. Retornando array vazio.");
    } else {
      console.error("Erro ao ler apps.json:", error);
    }
    return [];
  }
}

export default async function Admin() {
  const data = await getData();

  return (
    <>
      <AdminHeader />

      <div className="max-w-7xl mx-auto mb-4">
        <div className="sm:flex justify-between items-center">
          <h2 className="text-lg text-gray-700 dark:text-gray-300">
            Bem-vindo à área de administração.
          </h2>
          <AddEditAppDialog />
        </div>
      </div>

      <main>
        <div className="w-full overflow-x-auto">
          <div className="mx-auto max-w-7xl">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </main>
      <Toaster />
    </>
  );
}
