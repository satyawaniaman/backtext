import crypto from "crypto";
import { db } from "@/server/db";

/**
 * We reuse the existing VerificationToken table for password resets.
 * identifier = user email, token = random string, expires = expiry date.
 */

const RESET_TOKEN_PREFIX = "pwreset:"; // namespace to distinguish if needed

export interface CreateResetTokenOptions {
  email: string;
  expiresInMinutes?: number; // default 15
}

export async function createPasswordResetToken({
  email,
  expiresInMinutes = 15,
}: CreateResetTokenOptions) {
  const token = crypto.randomBytes(24).toString("hex");
  const expires = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  // Clean old tokens for this email (optional hygiene)
  await db.verificationToken.deleteMany({
    where: { identifier: RESET_TOKEN_PREFIX + email },
  });

  await db.verificationToken.create({
    data: {
      identifier: RESET_TOKEN_PREFIX + email,
      token,
      expires,
    },
  });
  return { token, expires };
}

export async function verifyPasswordResetToken(email: string, token: string) {
  const record = await db.verificationToken.findFirst({
    where: {
      identifier: RESET_TOKEN_PREFIX + email,
      token,
    },
  });
  if (!record) return { valid: false as const, reason: "not_found" };
  if (record.expires < new Date()) {
    return { valid: false as const, reason: "expired" };
  }
  return { valid: true as const };
}

export async function consumePasswordResetToken(email: string, token: string) {
  await db.verificationToken.deleteMany({
    where: { identifier: RESET_TOKEN_PREFIX + email, token },
  });
}
