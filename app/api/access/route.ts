import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasFullAccess } from "@/lib/stripe";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ access: "none" });
  }

  const paid = await hasFullAccess(session.user.email);
  return NextResponse.json({
    access: paid ? "full" : "free",
    freeChapters: Number(process.env.FREE_CHAPTERS_COUNT ?? 2),
    email: session.user.email,
  });
}
