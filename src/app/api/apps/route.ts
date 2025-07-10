import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  const filePath = path.join(process.cwd(), "src/data/apps.json");

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const apps = JSON.parse(data);
    return NextResponse.json(apps);
  } catch (error) {
    console.error("Erro ao ler apps.json:", error);
    return NextResponse.json([], { status: 500 });
  }
}
