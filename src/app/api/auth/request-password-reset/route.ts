import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { rateLimit } from "@/server/rate-limit";
import { createPasswordResetToken } from "@/server/security/password-reset";
import { sendPasswordResetEmail } from "@/server/email/send-password-reset";

// Input schema
const schema = z.object({
  email: z.string().email(),
});

// Rate limit constants
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 3; // per email

export async function POST(req: NextRequest) {
  try {
  const json: unknown = await req.json();
  const { email } = schema.parse(json);

    // Rate limit by email (and optionally IP)
    const rl = rateLimit({
      key: `pwreq:${email.toLowerCase()}`,
      windowMs: WINDOW_MS,
      max: MAX_REQUESTS_PER_WINDOW,
    });
    if (!rl.ok) {
      return NextResponse.json(
        {
          error: "Too many reset requests. Please wait before trying again.",
          retryAfterSeconds: rl.retryAfter,
        },
        { status: 429 },
      );
    }

    // Check if user exists; do not reveal existence precisely
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { email: true },
    });

    if (user) {
      const { token, expires } = await createPasswordResetToken({ email });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "http://localhost:3000";
      await sendPasswordResetEmail({
        to: email,
        token,
        baseUrl,
        expiresAt: expires,
      });
      return NextResponse.json({
        message: "If that account exists, a reset email has been sent. If you requested a reset, check your inbox.",
        devToken: process.env.NODE_ENV !== "production" ? token : undefined,
        expiresAt: expires.toISOString(),
      });
    }

    // Always return generic response for non-existent user
    return NextResponse.json({
      message: "If that account exists, a reset email has been sent.",
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error("request-password-reset error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
