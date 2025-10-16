import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    `token=; Path=/; HttpOnly; SameSite=Lax; Secure`
  );
  return res;
}