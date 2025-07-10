"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, EditIcon } from "lucide-react";
import z from "zod";
import { AddEditAppDialog } from "./add-edit-app-dialog";
import { DeleteAppDialog } from "./delete-app-dialog";
import { appSchema } from "../_action/schema";
import Image from "next/image";

export type App = z.infer<typeof appSchema>;

export const columns: ColumnDef<App>[] = [
  {
    accessorKey: "color",
    header: "",
    cell: "",
  },
  {
    accessorKey: "icon",
    header: "Ícone",
    cell: ({ row }) => {
      const icon = row.getValue("icon") as string;
      const color = row.getValue("color") as string;

      return (
        <div
          className="w-10 h-10 rounded-[8px] flex items-center justify-center"
          style={{ background: color }}
        >
          <Image
            className="w-6 h-6 object-contain"
            src={icon}
            alt="App Icon"
            width="36"
            height="36"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="text-wrap">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: app } }) => {
      return (
        <div className="space-x-1 flex items-center">
          <AddEditAppDialog initialData={app}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:cursor-pointer text-blue-500 hover:text-blue-600"
              aria-label={`Editar ${app.name}`}
            >
              <EditIcon className="h-4 w-4" />
            </Button>
          </AddEditAppDialog>

          <DeleteAppDialog appId={app.id ?? ""} appName={app.name ?? ""} />
        </div>
      );
    },
  },
];
