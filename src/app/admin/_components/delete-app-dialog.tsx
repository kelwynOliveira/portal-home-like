"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { deleteApp } from "../_action/delete-app";
import { toast } from "sonner";

interface DeleteAppDialogProps {
  appId: string;
  appName: string;
}

export function DeleteAppDialog({ appId, appName }: DeleteAppDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDeleting(true);

    const formData = new FormData(event.currentTarget);
    const result = await deleteApp(formData);
    if (result.success) {
      setOpen(false);
      toast(result.message);
    } else {
      toast(`Erro ao excluir: ${result.message}`);
    }
    setIsDeleting(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600 hover:cursor-pointer"
          aria-label={`Excluir ${appName}`}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-(--secondary) sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir o aplicativo{" "}
            <strong>{appName}</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDelete}>
          {" "}
          <input type="hidden" name="id" value={appId} />{" "}
          <DialogFooter className="flex sm:justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isDeleting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
