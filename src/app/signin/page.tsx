"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/schema/auth";
import { ZodError } from "zod";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  // Reset password handled on /reset-password now
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      await signIn("google", { callbackUrl: "/dashboard", redirect: true });
    } catch (e) {
      console.error("Google sign in error", e);
      setError("Failed to sign in with Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleCredentialsSignIn = async (formData: FormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setFieldErrors({});
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      try {
        loginSchema.parse({ email, password });
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          const errors: { email?: string; password?: string } = {};
          validationError.errors.forEach((err) => {
            if (err.path[0] === "email") errors.email = err.message;
            if (err.path[0] === "password") errors.password = err.message;
          });
          setFieldErrors(errors);
          return;
        }
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Invalid email or password.");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (e) {
      console.error("Credentials sign in error", e);
      setError("Unexpected error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
        <div className="p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              <Image
                src="/logo.svg"
                alt="Backtext logo"
                width={100}
                height={100}
              />
            </Link>
            <h1 className="mt-4 mb-1 text-xl font-semibold">
              Sign In or Create Account
            </h1>
            <p className="text-sm">Enter your credentials to sign in or create a new account</p>
          </div>

          {error && (
            <div className="text-destructive bg-destructive/10 border-destructive/20 mt-4 rounded-md border p-3 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="w-full"
            >
              {isGoogleLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.98em"
                  height="1em"
                  viewBox="0 0 256 262"
                >
                  <path
                    fill="#4285f4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34a853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#fbbc05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  ></path>
                  <path
                    fill="#eb4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
              )}
              <span>{isGoogleLoading ? "Signing in..." : "Google"}</span>
            </Button>
          </div>

          <hr className="my-4 border-dashed" />

          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleCredentialsSignIn(formData);
          }} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                disabled={isLoading || isGoogleLoading}
                aria-invalid={!!fieldErrors.email}
                className={fieldErrors.email ? "border-destructive" : ""}
              />
              {fieldErrors.email && (
                <p className="text-destructive text-sm">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  type="button"
                  className="link intent-info variant-ghost text-sm"
                >
                  <Link href="/reset-password">Forgot your Password?</Link>
                </Button>
              </div>
              <Input
                type="password"
                required
                name="password"
                id="password"
                disabled={isLoading || isGoogleLoading}
                aria-invalid={!!fieldErrors.password}
                className={fieldErrors.password ? "border-destructive" : ""}
              />
              {fieldErrors.password && (
                <p className="text-destructive text-sm">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
                  <span>Processing...</span>
                </>
              ) : (
                "Sign In / Create Account"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Password reset handled via /reset-password */}
    </section>
  );
}
