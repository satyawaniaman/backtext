import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { rateLimit } from "@/server/rate-limit";
import { auth } from "@/server/auth";

const updatePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters"),
});

// Rate limit constants
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS_PER_WINDOW = 5; // per user

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json();
    const { newPassword } = updatePasswordSchema.parse(body);

    // Rate limit per user
    const rl = rateLimit({
      key: `pwupdate:${session.user.email}`,
      windowMs: WINDOW_MS,
      max: MAX_ATTEMPTS_PER_WINDOW,
    });
    if (!rl.ok) {
      return NextResponse.json(
        {
          error: "Too many password update attempts. Please wait before trying again.",
          retryAfterSeconds: rl.retryAfter,
        },
        { status: 429 },
      );
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password in database
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors?.[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("update-password-simple error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}