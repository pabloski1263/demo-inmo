import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "data", "images");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    let targetDir = UPLOAD_DIR;
    if (folder) {
      targetDir = path.join(UPLOAD_DIR, folder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(targetDir, filename), buffer);

    const url = folder ? `/api/images/${folder}/${filename}` : `/api/images/${filename}`;
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Error al subir" }, { status: 500 });
  }
}
