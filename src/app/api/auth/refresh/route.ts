// New Version

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendUrl } from '@/server/backend/api-client';

export async function POST() {
  const backendUrl = getBackendUrl('/auth/refresh');
  if (!backendUrl) {
    return NextResponse.json(
      { message: 'Backend API is not configured.' },
      { status: 503 }
    );
  }

  // 1. اقرا الـ refresh_token من الـ HttpOnly cookie
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: 'Refresh token is missing.' },
      { status: 401 }
    );
  }

  // 2. أبعت للباك إند
  // ملاحظة: الباك إند بتاعك بيقرا الـ refresh_token من الـ Cookie،
  // فبنبعته في الـ Cookie header
  const backendRes = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': `refresh_token=${refreshToken}`,
    },
  });

  const data = await backendRes.json();

  // 3. لو فشل، رجّع الخطأ
  if (!backendRes.ok) {
    // امسح الـ cookie لو الـ refresh فشل
    const errorResponse = NextResponse.json(data, { status: backendRes.status });
    errorResponse.cookies.delete('refresh_token');
    return errorResponse;
  }

  // 4. رجّع الـ access_token الجديد للفرونت
  return NextResponse.json({
    success: data.success,
    message: data.message,
    data: {
      access_token: data.data.access_token,
      token_type: data.data.token_type,
      expires_in: data.data.expires_in,
    },
  });
}