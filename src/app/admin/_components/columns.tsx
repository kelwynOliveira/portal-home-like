"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, EditIcon } from "lucide-react";
import z from "zod";
import { AddEditAppDialog } from "./add-edit-app-dialog";
import { DeleteAppDialog } from "./delete-app-dialog";
import { appSchema } from "../_action/schema";

export type App = z.infer<typeof appSchema>;

export const columns: ColumnDef<App>[] = [
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
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "description",
    header: "Descrição",
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
