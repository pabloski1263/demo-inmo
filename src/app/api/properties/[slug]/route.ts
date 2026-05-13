import { NextResponse } from "next/server";
import { getProperties, getPropertyBySlug, saveProperties } from "@/lib/properties";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
  }

  return NextResponse.json(property);
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { slug } = await params;
  const properties = getProperties();
  const index = properties.findIndex((p) => p.slug === slug);

  if (index === -1) {
    return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
  }

  try {
    const body = await req.json();
    properties[index] = {
      ...properties[index],
      ...body,
      id: properties[index].id,
      slug: properties[index].slug,
      created_at: properties[index].created_at,
      updated_at: new Date().toISOString(),
    };

    saveProperties(properties);
    return NextResponse.json({ success: true, property: properties[index] });
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { slug } = await params;
  const properties = getProperties();
  const index = properties.findIndex((p) => p.slug === slug);

  if (index === -1) {
    return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
  }

  properties.splice(index, 1);
  saveProperties(properties);

  return NextResponse.json({ success: true });
}
