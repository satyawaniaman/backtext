import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { rateLimit } from "@/server/rate-limit";
import { verifyPasswordResetToken, consumePasswordResetToken } from "@/server/security/password-reset";

/**
 * Secure password reset completion endpoint.
 * Step 1: Client calls /api/auth/request-password-reset with email.
 * Step 2: User receives token (email). In dev we expose token in response.
 * Step 3: Client submits { email, token, newPassword } here.
 */

const completeResetSchema = z.object({
  email: z.string().email(),
  token: z.string().min(10),
  newPassword: z.string().min(6).max(72), // bcrypt limit
});

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5; // generous for completion attempts

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const { email, token, newPassword } = completeResetSchema.parse(body);

    // Rate limit per email+token combo to avoid brute force
    const rl = rateLimit({
      key: `pwcomplete:${email.toLowerCase()}:${token.slice(0,8)}`,
      windowMs: WINDOW_MS,
      max: MAX_PER_WINDOW,
    });
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait before retrying." },
        { status: 429 },
      );
    }

    const verification = await verifyPasswordResetToken(email, token);
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.reason === "expired" ? "Token expired" : "Invalid token" },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid token or user" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await db.user.update({
      where: { email },
      data: { password: hashed },
    });

    await consumePasswordResetToken(email, token);

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("secure reset error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
