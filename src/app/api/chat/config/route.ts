import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = getContent();
  return NextResponse.json({
    enabled: content.chat.enabled,
    greeting_en: content.chat.greeting_en,
    greeting_es: content.chat.greeting_es,
    greeting_fr: content.chat.greeting_fr,
    greeting_de: content.chat.greeting_de,
    greeting_it: content.chat.greeting_it,
    greeting_pt: content.chat.greeting_pt,
  });
}
