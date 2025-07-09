"use server";

import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { appSchema, appsFilePath } from "./schema";

type App = z.infer<typeof appSchema>;

export async function saveApp(formData: FormData) {
  try {
    // Extract data from formData
    const appData = {
      id: formData.get("id")?.toString() || undefined,
      name: formData.get("name")?.toString(),
      description: formData.get("description")?.toString(),
      url: formData.get("url")?.toString(),
      icon: formData.get("icon")?.toString(),
      category: formData.get("category")?.toString(),
      color: formData.get("color")?.toString(),
    };

    // Validate data using zod schema
    const validatedData = appSchema.safeParse(appData);
    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid data.",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const newOrUpdatedApp = validatedData.data;

    let apps: App[] = [];
    try {
      // Try to read the existing apps file
      const fileContent = await fs.readFile(appsFilePath, "utf-8");
      apps = JSON.parse(fileContent);
    } catch (readError: unknown) {
      // If file does not exist, initialize with empty array
      if (
        typeof readError === "object" &&
        readError !== null &&
        "code" in readError &&
        (readError as { code?: string }).code === "ENOENT"
      ) {
        console.warn("apps.json file not found, creating a new one.");
        apps = [];
      } else {
        throw readError;
      }
    }

    let appFound = false;
    // If ID is found, update only changed fields
    if (newOrUpdatedApp.id) {
      apps = apps.map((app) => {
        if (app.id === newOrUpdatedApp.id) {
          appFound = true;
          return { ...app, ...newOrUpdatedApp };
        }
        return app;
      });
    }

    // If ID is not found, add a new app
    if (!appFound) {
      const id = uuidv4();
      apps.push({ ...newOrUpdatedApp, id });
    }

    // Write updated apps array back to file
    await fs.writeFile(appsFilePath, JSON.stringify(apps, null, 2), "utf-8");

    return { success: true, message: "App saved successfully!" };
  } catch (error: unknown) {
    console.error("Error saving app:", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return {
      success: false,
      message: `Error saving app: ${errorMessage}`,
    };
  }
}
