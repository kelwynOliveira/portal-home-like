"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import { Eye, EyeOff } from "lucide-react";
import { loginAdmin } from "./_actions/login";
import { loginSchema } from "./_actions/schema";

export default function ProfileForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    const res = await loginAdmin(formData);

    if (res.success) {
      redirect("/admin");
    } else {
      toast(res.message || "Erro de login: Credenciais inválidas");
    }
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Toaster />
      <Card className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Entre na conta de administrador</CardTitle>
          <CardDescription>Insira o email de administrador</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <CardContent className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor={field.name}>Email</FormLabel>
                        <FormControl>
                          <Input id={field.name} type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <FormItem>
                        <FormLabel htmlFor={field.name}>Senha</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              id={field.name}
                              type={showPassword ? "text" : "password"}
                              className="pr-10"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white hover:cursor-pointer"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                          <FormMessage />
                        </div>
                      </FormItem>
                    </div>
                  )}
                />
              </CardContent>
            </div>
            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full text-white text-[1rem] gradient-bg uppercase rounded-md transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer "
              >
                Login
              </Button>
              <Link
                href="/"
                className="text-center p-2 w-full text-white text-[1rem] uppercase rounded-md transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer "
              >
                Home
              </Link>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
