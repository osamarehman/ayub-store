import NextAuth from "next-auth";
import authConfig from "@/lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Protected routes
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isCheckoutRoute = nextUrl.pathname.startsWith("/checkout");
  const isAccountRoute = nextUrl.pathname.startsWith("/account");

  // Redirect to login if trying to access protected routes while not logged in
  if (!isLoggedIn && (isCheckoutRoute || isAccountRoute || isAdminRoute)) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return Response.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  // Admin routes require ADMIN role
  if (isAdminRoute && isLoggedIn && userRole !== "ADMIN") {
    return Response.redirect(new URL("/", nextUrl));
  }

  return null; // Continue with the request
});

// Matcher for protected routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logos|favicons).*)"],
};
