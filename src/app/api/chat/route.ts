import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";
import { getProperties } from "@/lib/properties";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const content = getContent();
    const { chat } = content;

    if (!chat.enabled) {
      return NextResponse.json({ error: "Chat deshabilitado" }, { status: 403 });
    }

    const apiKey = chat.api_key || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key no configurada" }, { status: 500 });
    }

    // Build context from site content
    const agent = content.agent;
    const siteContext = `Sitio web de ${agent.first_name} ${agent.last_name}
Título: ${agent.title_en}
Brokerage: ${agent.brokerage.name}
Teléfono: ${content.contact.phone}
Email: ${content.contact.email}
Dirección: ${content.contact.address}
Descripción: ${agent.bio_en}
Especialidades: ${agent.expertise_areas.map((a) => a.title_en).join(", ")}
Idiomas: ${agent.languages.join(", ")}`;

    // Build properties context
    const properties = getProperties();
    const propsContext = properties
      .slice(0, 100)
      .map(
        (p) =>
          `- ${p.title_en} | ${p.title_es} | ${p.city}, ${p.region} | ${p.beds} beds, ${p.baths} baths, ${p.sqft} sqft | $${p.price} ${p.currency} | Status: ${p.status} | Tipo: ${p.property_type} | URL: /properties/${p.slug}`
      )
      .join("\n");

    const systemPrompt = `${chat.system_prompt}

INFORMACIÓN DEL SITIO:
${siteContext}

PROPIEDADES DISPONIBLES:
${propsContext || "No hay propiedades disponibles actualmente."}

IMPORTANTE: Siempre responde en el mismo idioma en que el usuario te escribe. Si te preguntan en español, responde en español. Si te preguntan en inglés, responde en inglés.`;

    // Prepare Gemini request with proper system_instruction
    const geminiMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${chat.model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
          ],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini error:", geminiRes.status, errText);
      return NextResponse.json({ error: "Error del asistente" }, { status: 502 });
    }

    const geminiData = await geminiRes.json();
    const text =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude generar una respuesta.";

    return NextResponse.json({ response: text });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
