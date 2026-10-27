// New Version

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const baseUrl = process.env.GYM_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { message: "Backend API is not configured." },
      { status: 503 },
    );
  }

  // 1. أبعت للباك إند
  const backendRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();

  // 2. لو فشل، رجّع الخطأ زي ما هو
  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  // 3. استخرج الـ refresh_token من الـ Set-Cookie header
  // الباك إند بيرجعه كـ HttpOnly cookie، فمش موجود في الـ JSON body
  const setCookieHeader = backendRes.headers.get("set-cookie");
  let refreshToken = null;

  if (setCookieHeader) {
    // استخرج القيمة من الـ header (شكلها: refresh_token=xxx; Path=/; HttpOnly...)
    const match = setCookieHeader.match(/refresh_token=([^;]+)/);
    if (match) {
      refreshToken = match[1];
    }
  }

  // 4. جهز الـ response للفرونت (الـ access_token بس)
  const response = NextResponse.json({
    success: data.success,
    message: data.message,
    data: {
      access_token: data.data.access_token,
      token_type: data.data.token_type,
      expires_in: data.data.expires_in,
      gym_id: data.data.gym_id,
      role: data.data.role,
    },
  });

  // 5. حط الـ refresh_token في HttpOnly cookie على الـ Next.js domain
  if (refreshToken) {
    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 أيام
    });
  }

  return response;
}
