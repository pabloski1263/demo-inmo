import { NextResponse } from "next/server";
import { validateCredentials, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!validateCredentials(email, password)) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = await createSession();
    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
