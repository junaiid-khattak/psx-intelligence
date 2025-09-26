import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return
  }

  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname === "/favicon.ico" ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/tickers"
  ) {
    return
  }

  // For now, skip Supabase middleware to avoid import issues
  // TODO: Re-enable once @supabase/ssr import is resolved
  console.log("[v0] Middleware bypassed for:", request.nextUrl.pathname)
  return
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
