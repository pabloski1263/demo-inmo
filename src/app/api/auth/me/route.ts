import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: Request) {
  const isAuth = await verifyAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
