"use server";

import { promises as fs } from "fs";
import { revalidatePath } from "next/cache";
import { appsFilePath } from "./schema";
import path from "path";

type App = {
  id: string;
  icon: string;
};

export async function deleteApp(formData: FormData) {
  try {
    // Get the app ID to delete from the form data
    const idToDelete = formData.get("id")?.toString();

    if (!idToDelete) {
      return {
        success: false,
        message: "Nenhum ID de aplicativo fornecido para exclusão.",
      };
    }

    let apps: App[] = [];
    try {
      // Read the current apps from the JSON file
      const fileContent = await fs.readFile(appsFilePath, "utf-8");
      apps = JSON.parse(fileContent);
    } catch (readError: unknown) {
      // Handle file not found error
      if (
        typeof readError === "object" &&
        readError !== null &&
        "code" in readError &&
        (readError as { code?: string }).code === "ENOENT"
      ) {
        return { success: false, message: "Arquivo apps.json não encontrado." };
      }
      // Rethrow other errors
      throw readError;
    }

    const appToDelete = apps.find((app) => app.id === idToDelete);
    if (!appToDelete) {
      return {
        success: false,
        message: "Aplicativo não encontrado para exclusão.",
      };
    }
    if (appToDelete.icon) {
      const imagePath = path.join(process.cwd(), "public", appToDelete.icon);
      try {
        await fs.unlink(imagePath);
        console.log(`Imagem deletada: ${imagePath}`);
      } catch (unlinkError: unknown) {
        console.error(`Erro ao deletar imagem ${imagePath}:`, unlinkError);
        // Continua a exclusão do registro mesmo que a imagem não possa ser deletada
      }
    }

    // Filter out the app to be deleted
    const updatedApps = apps.filter((app) => app.id !== idToDelete);
    await fs.writeFile(
      appsFilePath,
      JSON.stringify(updatedApps, null, 2),
      "utf-8"
    );
    revalidatePath("/admin");

    return { success: true, message: "Aplicativo excluído com sucesso!" };
  } catch (error: unknown) {
    console.error("Erro ao excluir o aplicativo:", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return {
      success: false,
      message: `Erro ao excluir o aplicativo: ${errorMessage}`,
    };
  }
}

// "use server";

// import { promises as fs } from "fs";
// import { revalidatePath } from "next/cache";
// import { appsFilePath } from "./schema";

// type App = {
//   id: string;
// };

// export async function deleteApp(formData: FormData) {
//   try {
//     // Get the app ID to delete from the form data
//     const idToDelete = formData.get("id")?.toString();

//     if (!idToDelete) {
//       return {
//         success: false,
//         message: "Nenhum ID de aplicativo fornecido para exclusão.",
//       };
//     }

//     let apps: App[] = [];
//     try {
//       // Read the current apps from the JSON file
//       const fileContent = await fs.readFile(appsFilePath, "utf-8");
//       apps = JSON.parse(fileContent);
//     } catch (readError: unknown) {
//       // Handle file not found error
//       if (
//         typeof readError === "object" &&
//         readError !== null &&
//         "code" in readError &&
//         (readError as { code?: string }).code === "ENOENT"
//       ) {
//         return { success: false, message: "Arquivo apps.json não encontrado." };
//       }
//       // Rethrow other errors
//       throw readError;
//     }

//     // Filter out the app to be deleted
//     const initialLength = apps.length;
//     const updatedApps = apps.filter((app) => app.id !== idToDelete);

//     if (updatedApps.length === initialLength) {
//       // Return error if app was not found
//       return {
//         success: false,
//         message: "Aplicativo não encontrado para exclusão.",
//       };
//     }

//     // Write the updated apps array back to the JSON file
//     await fs.writeFile(
//       appsFilePath,
//       JSON.stringify(updatedApps, null, 2),
//       "utf-8"
//     );

//     // Revalidate the /admin path to update the UI
//     revalidatePath("/admin");

//     // Return success message
//     return { success: true, message: "Aplicativo excluído com sucesso!" };
//   } catch (error: unknown) {
//     // Log and return error message
//     console.error("Erro ao excluir o aplicativo:", error);
//     let errorMessage = "Erro desconhecido ao excluir o aplicativo.";
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }
//     return {
//       success: false,
//       message: `Erro ao excluir o aplicativo: ${errorMessage}`,
//     };
//   }
// }
