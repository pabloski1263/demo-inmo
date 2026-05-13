import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = getContent();
  return NextResponse.json({
    enabled: content.chat.enabled,
    greeting: content.chat.greeting,
  });
}
