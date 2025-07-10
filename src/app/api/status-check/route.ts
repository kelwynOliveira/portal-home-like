import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url } = await req.json();

  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return NextResponse.json({ status: res.ok ? "online" : "offline" });
  } catch {
    return NextResponse.json({ status: "offline" });
  }
}
