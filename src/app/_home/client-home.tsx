"use client";

import { useEffect, useState } from "react";
import AppCard from "./app-card";
import SearchBar from "./search";
import FilterControls from "./filter";
import { AppWithStatus, App } from "./types";

export default function ClientHome() {
  const [appList, setAppList] = useState<AppWithStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "status">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    async function fetchAndCheckApps() {
      try {
        const res = await fetch("/api/apps", { cache: "no-store" });
        const apps: App[] = await res.json();

        const statusChecked: AppWithStatus[] = await Promise.all(
          apps.map(async (app) => {
            try {
              const statusRes = await fetch("/api/status-check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: app.url }),
              });
              const data = await statusRes.json();
              return { ...app, status: data.status };
            } catch {
              return { ...app, status: "offline" };
            }
          })
        );

        setAppList(statusChecked);
      } catch (err) {
        console.error("Erro ao buscar apps:", err);
      }
    }

    fetchAndCheckApps();
  }, []);

  const filteredApps = appList
    .filter(
      (app) =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const modifier = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "name") {
        return a.name.localeCompare(b.name) * modifier;
      } else {
        return a.status.localeCompare(b.status) * modifier;
      }
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FilterControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
        />
      </div>

      <main>
        <AppCard apps={filteredApps} />
      </main>
    </div>
  );
}
