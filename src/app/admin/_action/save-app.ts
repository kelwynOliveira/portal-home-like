"use server";

import { revalidatePath } from "next/cache";
import path from "path";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { appImagesDir, appSchema, appsFilePath } from "./schema";

type App = z.infer<typeof appSchema>;

export async function saveApp(formData: FormData) {
  try {
    // make sure dir exists
    await fs.mkdir(appImagesDir, { recursive: true });

    const iconFile = formData.get("iconFile") as File | null;
    const existingIconPathFromForm = formData.get("icon")?.toString(); // get icon public route

    let currentApps: App[] = [];
    try {
      const fileContent = await fs.readFile(appsFilePath, "utf-8");
      currentApps = JSON.parse(fileContent);
      console.log("apps.json lido com sucesso.");
    } catch (readError: unknown) {
      if (
        typeof readError === "object" &&
        readError !== null &&
        "code" in readError &&
        (readError as { code?: string }).code === "ENOENT"
      ) {
        console.warn("apps.json file not found, creating a new one.");
        currentApps = [];
      } else {
        throw readError;
      }
    }

    const appId = formData.get("id")?.toString();

    // get old icon file path
    let oldIconPath: string | undefined;
    if (appId) {
      const existingApp = currentApps.find((app) => app.id === appId);
      if (existingApp) {
        oldIconPath = existingApp.icon;
      }
    }

    let finalIconPath: string | undefined;

    // new file sent
    if (iconFile && iconFile.size > 0) {
      const fileExtension = path.extname(iconFile.name);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(appImagesDir, uniqueFileName);
      const bytes = await iconFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await fs.writeFile(filePath, buffer);
      finalIconPath = `/assets/apps-images/${uniqueFileName}`;

      // Delete old image
      if (oldIconPath && oldIconPath !== finalIconPath) {
        const oldFilePath = path.join(process.cwd(), "public", oldIconPath);
        try {
          await fs.unlink(oldFilePath);
        } catch (unlinkError: unknown) {
          console.error(
            `Error deleting old image ${oldFilePath}:`,
            unlinkError
          );
        }
      }
    }
    // changed infos but not icon file [keep old image path]
    else if (existingIconPathFromForm) {
      finalIconPath = existingIconPathFromForm;
    }

    if (!finalIconPath && appSchema.shape.icon.isOptional() === false) {
      console.error(
        "Erro: Ícone do aplicativo é obrigatório, mas não foi fornecido."
      );
      return {
        success: false,
        message: "O ícone do aplicativo é obrigatório.",
      };
    }

    // Save / Update App info

    const appData = {
      id: appId,
      name: formData.get("name")?.toString(),
      description: formData.get("description")?.toString(),
      url: formData.get("url")?.toString(),
      icon: finalIconPath,
      category: formData.get("category")?.toString(),
      color: formData.get("color")?.toString(),
    };

    const validatedData = appSchema.safeParse(appData);
    if (!validatedData.success) {
      console.error(
        "Validation error:",
        validatedData.error.flatten().fieldErrors
      );
      return {
        success: false,
        message: "Dados inválidos.",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const appToSave = validatedData.data;
    let appFound = false;
    let updatedApps: App[] = [];

    if (appToSave.id) {
      updatedApps = currentApps.map((app) => {
        if (app.id === appToSave.id) {
          appFound = true;
          return { ...app, ...appToSave };
        }
        return app;
      });
    }

    if (!appFound) {
      const id = uuidv4();
      updatedApps = [...currentApps, { ...appToSave, id }];
    }

    // Writing json apps
    await fs.writeFile(
      appsFilePath,
      JSON.stringify(updatedApps, null, 2),
      "utf-8"
    );

    revalidatePath("/admin");

    return { success: true, message: "Aplicativo salvo com sucesso!" };
  } catch (error: unknown) {
    console.error("Erro geral ao salvar o aplicativo:", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return {
      success: false,
      message: `Erro ao salvar o aplicativo: ${errorMessage}`,
    };
  }
}
