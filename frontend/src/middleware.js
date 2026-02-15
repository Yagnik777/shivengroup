import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    const path = req.nextUrl.pathname; 
    const role = token?.role;

    // --- DEBUGGING LOGS ---
    console.log("--------------------------------------");
    console.log("PATH:", path);
    console.log("TOKEN ROLE:", role);

    // ૧. જો રોલ 'recruiter' હોય અને યુઝર પેજ એક્સેસ કરવાની કોશિશ કરે
    if (path.startsWith("/user") && role !== "user") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ૨. જો રોલ 'user' હોય અને રેક્રુટર પેજ એક્સેસ કરવાની કોશિશ કરે
    if (path.startsWith("/recruiter") && role !== "recruiter") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ૩. Service Provider સિક્યોરિટી
    if (path.startsWith("/serviceprovider") && role !== "serviceprovider") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // ૪. Admin સિક્યોરિટી
    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // --- CACHE CONTROL HEADERS ADDED HERE ---
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/recruiter/:path*",
    "/serviceprovider/:path*",
    "/user/:path*",
  ],
};