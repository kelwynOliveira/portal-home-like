import Header from "./_home/header";
import ClientHome from "./_home/client-home";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-end">
        <Link
          href="/admin"
          className="uppercase text-sm text-white gradient-bg px-6 py-3 shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer"
        >
          Admin
        </Link>
      </div>
      <Header />
      <ClientHome />
    </div>
  );
}
