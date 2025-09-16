import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const { email, newPassword } = resetPasswordSchema.parse(body);

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 },
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password
    await db.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
