import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = getContent();
  const safe = { ...content, admin: undefined };
  return NextResponse.json(safe);
}

export async function PUT(req: Request) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const current = getContent();
    const updated = { ...current, ...body, admin: current.admin };

    if (body.admin?.email || body.admin?.password) {
      updated.admin.email = body.admin.email ?? current.admin.email;
      updated.admin.password = body.admin.password ?? current.admin.password;
    }

    saveContent(updated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
