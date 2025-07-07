import { Server, Wifi } from "lucide-react";

export default function Header() {
  return (
    <header className="text-center mb-12">
      <div className="relative inline-block mb-6">
        <Server className="server-icon w-16 h-16 text-blue-600 animate-pulse" />
        <Wifi className="wifi-icon w-8 h-8 text-green-500 absolute -top-4 -right-3" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold gradient-bg text-gradient bg-clip-text mb-4">
        LiKe Home Server
      </h1>
      <p className="font-medium">Central de acesso às aplicações do servidor</p>
    </header>
  );
}
