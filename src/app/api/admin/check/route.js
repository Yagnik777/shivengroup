import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ loggedIn: false });

    const user = verifyToken(token);
    if (!user) return NextResponse.json({ loggedIn: false });

    return NextResponse.json({ loggedIn: true, user });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
