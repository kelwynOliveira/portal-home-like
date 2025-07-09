"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import z from "zod";
import { saveApp } from "../_action/save-app";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Plus, UploadCloud } from "lucide-react";
import { appSchema } from "../_action/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

interface AddAppDialogProps {
  initialData?: z.infer<typeof appSchema>;
  children?: React.ReactNode;
}

export function AddEditAppDialog({ initialData, children }: AddAppDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(
    initialData?.icon || null
  );
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<z.infer<typeof appSchema>>({
    resolver: zodResolver(appSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      url: "",
      icon: "",
      category: "",
      color: "",
    },
  });

  React.useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setFilePreview(initialData?.icon || null);
      form.reset(
        initialData || {
          name: "",
          description: "",
          url: "",
          icon: "",
          category: "",
          color: "",
        }
      );
    } else {
      setFilePreview(initialData?.icon || null);
      form.reset(
        initialData || {
          name: "",
          description: "",
          url: "",
          icon: "",
          category: "",
          color: "",
        }
      );
    }
  }, [open, initialData, form]);

  const handleFileChange = useCallback((file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files[0]);
        form.setValue("icon", e.dataTransfer.files[0].name);
      }
    },
    [handleFileChange, form]
  );

  async function onSubmit(values: z.infer<typeof appSchema>) {
    const formData = new FormData();
    if (values.id) formData.append("id", values.id);
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("url", values.url);
    formData.append("icon", values.icon);
    formData.append("category", values.category);
    formData.append("color", values.color);

    if (selectedFile) {
      formData.append("iconFile", selectedFile);
    }

    const result = await saveApp(formData);

    if (result.success) {
      console.log(result.message);
      form.reset();
      setOpen(false);
    } else {
      console.error(result.message, result.errors);
    }
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar aplicativo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-(--secondary) sm:max-w-[425px] flex flex-col max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Adicionar nova aplicação</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto px-6 py-4 hide-scrollbar">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel htmlFor={field.name}>Nome</FormLabel>
                    <FormControl>
                      <Input id={field.name} placeholder="Olimpo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel htmlFor={field.name}>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        id={field.name}
                        placeholder="Conversor de arquivos"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel htmlFor={field.name}>Categoria</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="Utilidades"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel htmlFor={field.name}>URL</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="http://olimpo.like"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel htmlFor={field.name}>URL do ícone</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="https://imgs.search.brave.com/3gWZT02rUq-eZOsAbhIDXDLMa6Lt5ikNYzZzmUHCE74/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTU3/NjQyNzAyL2VzL2Zv/dG8vbW9udGUtb2x5/bXB1cy1lbi1udWJl/cy1zZWRlLWRlLWxv/cy1kaW9zZXMuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPWFs/Y2dVVXg0WTlKM1ds/b0tZWkdyVldKc3BU/Uko1am9LUko0SVBL/NEgtZFE9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel htmlFor="icon-upload">
                      Ícone do Aplicativo
                    </FormLabel>
                    <FormControl>
                      <div
                        className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer
                            ${
                              isDragging
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 bg-gray-50"
                            }
                          `}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        {filePreview ? (
                          // <img
                          //   src={filePreview}
                          //   alt="Prévia do ícone"
                          //   className="max-h-24 max-w-full object-contain mb-2 rounded-md"
                          // />
                          <Image
                            src={filePreview}
                            alt="Prévia do ícone"
                            width={96}
                            height={96}
                            className="max-h-24 max-w-full object-contain mb-2 rounded-md"
                            unoptimized
                          />
                        ) : (
                          <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
                        )}
                        <p className="text-sm text-gray-500 mb-2">
                          {selectedFile
                            ? selectedFile.name
                            : "Arraste e solte ou clique para selecionar"}
                        </p>
                        <Input
                          id="icon-upload"
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileChange(e.target.files[0]);
                              field.onChange(e.target.files[0].name);
                            } else {
                              handleFileChange(null);
                              field.onChange("");
                            }
                          }}
                        />
                        <label
                          htmlFor="icon-upload"
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          Selecionar arquivo
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Cor (CSS)</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="linear-gradient(135deg, #3b82f6, #8b5cf6)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="uppercase text-white px-6 py-3 shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="uppercase text-white gradient-bg px-6 py-3 shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer"
                >
                  {form.formState.isSubmitting
                    ? "Salvando..."
                    : "Salvar Aplicativo"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
