import { logoutAdmin } from "@/app/login/_actions/logout";
import { Button } from "@/components/ui/button";

export default function AdminHeader() {
  return (
    <header className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 gradient-bg text-gradient">
          LiKe Home Server
        </h1>
        <form action={logoutAdmin} className="mb-4">
          <Button
            type="submit"
            className="uppercase text-white gradient-bg px-6 py-3 shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer"
          >
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
}
