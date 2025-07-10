import Image from "next/image";
import { App } from "./types";

interface AppCardProps {
  apps: (App & { status: "online" | "offline" })[];
}

export default function AppCard({ apps }: AppCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {apps.map((app) => (
        <a
          key={app.id}
          href={app.url}
          className="p-4 rounded-2xl  backdrop-blur-md text-white border border-white/10 transition hover:scale-[1.05] hover:border-(--primary)"
          data-name={app.name.toLowerCase()}
          data-description={app.description.toLowerCase()}
          data-category={app.category.toLowerCase()}
          title={app.status === "offline" ? "Aplicação offline" : ""}
          target="_blank"
        >
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-12 h-12 rounded-[8px] flex items-center justify-center"
              style={{ background: app.color }}
            >
              <Image
                className="w-8 h-8 object-contain"
                src={app.icon}
                alt={`${app.name} logo`}
                width={32}
                height={32}
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{app.name}</h3>
              <p className="text-sm text-gray-300">{app.category}</p>
            </div>
          </div>
          <p className="text-gray-400 mb-3 text-sm">{app.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span
              className={`w-2 h-2 rounded-full ${
                app.status === "online" ? "bg-green-400" : "bg-red-400"
              }`}
            />
            {app.status === "online" ? "Online" : "Offline"}
          </div>
        </a>
      ))}
    </div>
  );
}
