import { Button } from "@/components/ui/button";
import { logoutAdmin } from "../login/_actions/logout";

export default function Admin() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Página de Administração</h1>
      <form action={logoutAdmin} className="mb-4">
        <Button
          type="submit"
          className="uppercase text-white bg-red-600 hover:bg-red-700 rounded-md px-6 py-3 shadow-lg transition-all duration-200 ease-in-out hover:scale-105"
        >
          Logout
        </Button>
      </form>
      <div className="text-lg text-gray-700 dark:text-gray-300">
        Bem-vindo à área de administração.
      </div>
    </div>
  );
}
