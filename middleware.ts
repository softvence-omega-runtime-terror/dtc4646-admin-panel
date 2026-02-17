import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/forgot-password/verify",
];
const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV ?? "";
console.log(BASE_URL);
// Decode JWT and check if expired (no library needed)
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true; // If can't decode, treat as expired
  }
}

async function tryRefreshToken(request: NextRequest, refreshToken: string) {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const data = await res.json();
    const newAccessToken = data.data.accessToken;
    const newRefreshToken = data.data.refreshToken;

    const response = NextResponse.next();

    response.cookies.set("auth_token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 15,
    });

    if (newRefreshToken) {
      response.cookies.set("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow public routes
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get("auth_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // No tokens at all → redirect to login
  if (!authToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // auth_token missing → try refresh
  if (!authToken && refreshToken) {
    return await tryRefreshToken(request, refreshToken);
  }

  // ✅ auth_token exists but EXPIRED → try refresh
  if (authToken && isTokenExpired(authToken)) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return await tryRefreshToken(request, refreshToken);
  }

  // Token valid → proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/((?!api|_next|favicon.ico|images|public).*)",
  ],
};
