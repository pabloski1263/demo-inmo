import { getContent, saveContent } from "@/lib/content";

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 40; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function validateCredentials(email: string, password: string): boolean {
  const content = getContent();
  return content.admin.email === email && content.admin.password === password;
}

export async function createSession(): Promise<string> {
  const token = generateToken();
  const content = getContent();
  content.admin.token = token;
  saveContent(content);

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set("demo-inmo-auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const content = getContent();
  delete content.admin.token;
  saveContent(content);

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set("demo-inmo-auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function verifyAuth(req?: Request): Promise<boolean> {
  let token: string | null = null;

  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  if (!token) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get("demo-inmo-auth")?.value ?? null;
    } catch {
      return false;
    }
  }

  if (!token) return false;

  const content = getContent();
  return content.admin.token === token;
}
