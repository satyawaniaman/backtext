import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface SendPasswordResetEmailOptions {
  to: string;
  token: string;
  baseUrl: string; // e.g. https://your-app.com
  expiresAt: Date;
}

export async function sendPasswordResetEmail({
  to,
  token,
  baseUrl,
  expiresAt,
}: SendPasswordResetEmailOptions) {
  if (!resend) {
    console.warn("Resend client not initialized (missing RESEND_API_KEY)");
    return { skipped: true } as const;
  }

  const resetLink = `${baseUrl.replace(/\/$/, "")}/reset-password?email=${encodeURIComponent(
    to,
  )}&token=${encodeURIComponent(token)}`;

  const html = `
    <div style="font-family:system-ui,Arial,sans-serif;max-width:560px;margin:24px auto;padding:16px;border:1px solid #e5e7eb;border-radius:8px">
      <h1 style="font-size:20px;margin:0 0 16px">Password Reset</h1>
      <p style="margin:0 0 12px">We received a request to reset the password for your account.</p>
      <p style="margin:0 0 12px">Use the button below to set a new password. This link expires at <strong>${expiresAt.toISOString()}</strong>.</p>
      <p style="margin:24px 0">
        <a href="${resetLink}" style="background:#111827;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block">Reset Password</a>
      </p>
      <p style="margin:0 0 12px">If you did not request this, you can safely ignore this email.</p>
      <p style="margin:32px 0 0;font-size:12px;color:#6b7280">If the button doesn't work, copy & paste this link:<br/>${resetLink}</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "Backtext Password Reset <no-reply@backtext.fun>",
      to,
      subject: "Reset your Backtext password",
      html,
    });
    return { sent: true } as const;
  } catch (error) {
    console.error("Failed to send password reset email", error);
    return { sent: false, error } as const;
  }
}
