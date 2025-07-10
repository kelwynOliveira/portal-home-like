"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FilterControlsProps {
  sortBy: "name" | "status";
  sortOrder: "asc" | "desc";
  setSortBy: (value: "name" | "status") => void;
  setSortOrder: (value: "asc" | "desc") => void;
}

export default function FilterControls({
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
}: FilterControlsProps) {
  return (
    <div className="flex gap-4 items-center">
      {/* Filtro de campo */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-2xl">
            Ordenar por: {sortBy === "name" ? "Nome" : "Status"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setSortBy("name")}>
            Nome
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSortBy("status")}>
            Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filtro de ordem */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-2xl">
            Ordem: {sortOrder === "asc" ? "Crescente" : "Decrescente"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Ordem</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setSortOrder("asc")}>
            Crescente
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSortOrder("desc")}>
            Decrescente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
