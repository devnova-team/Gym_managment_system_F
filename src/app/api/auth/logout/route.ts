// New Version

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const baseUrl = process.env.GYM_API_BASE_URL;
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // 1. بلّغ الباك إند (لو عايز)
  if (baseUrl && refreshToken) {
    try {
      await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      });
    } catch (err) {
      console.error("Backend logout failed:", err);
    }
  }

  // 2. امسح الـ HttpOnly cookie من الـ Next.js domain
  const response = NextResponse.json({ success: true });
  response.cookies.delete("refresh_token");
  return response;
}
