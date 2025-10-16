import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  // ✅ Clear cookie properly
  response.headers.append(
    "Set-Cookie",
    "token=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0"
  );

  return response;
}
