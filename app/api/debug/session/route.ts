import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function GET() {
  const session = await auth();

  return NextResponse.json({
    session,
    authenticated: !!session,
    userRole: session?.user?.role,
  });
}
