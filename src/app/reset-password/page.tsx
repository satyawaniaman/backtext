"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

enum ViewState {
  Request = "request",
  Complete = "complete",
  Done = "done",
}

function ResetPasswordInner() {
  const params = useSearchParams();
  const router = useRouter();
  const emailParam = params.get("email") ?? "";
  const tokenParam = params.get("token") ?? "";

  const [view, setView] = useState<ViewState>(ViewState.Request);
  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  useEffect(() => {
    if (emailParam && tokenParam) {
      setView(ViewState.Complete);
    }
  }, [emailParam, tokenParam]);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { message?: string; error?: string; devToken?: string };
      if (res.ok) {
        setMessage(data.message ?? "If that account exists, a reset email has been sent.");
        if (data.devToken) setDevToken(data.devToken);
        setView(ViewState.Complete); // Allow immediate token entry
      } else {
        setError(data.error ?? "Failed to request reset");
      }
  } catch {
      setError("Unexpected error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (res.ok) {
        setMessage(data.message ?? "Password reset successfully.");
        setView(ViewState.Done);
        setTimeout(() => router.push("/signin"), 1800);
      } else {
        setError(data.error ?? "Failed to reset password");
      }
  } catch {
      setError("Unexpected error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Reset Password</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {view === ViewState.Request && "Enter your email address to request a password reset."}
          {view === ViewState.Complete && "Enter the token sent to your email and choose a new password."}
          {view === ViewState.Done && "Your password has been updated."}
        </p>

        {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {message && <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}
        {devToken && view !== ViewState.Done && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700">
            Dev token: {devToken}
          </div>
        )}

        {view === ViewState.Request && (
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Requesting..." : "Request Reset"}
            </Button>
            <Link href="/signin" className="block text-center text-xs underline">
              Back to sign in
            </Link>
          </form>
        )}

        {view === ViewState.Complete && (
          <form onSubmit={handleComplete} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="token">Token</Label>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Updating..." : "Reset Password"}
            </Button>
            <button
              type="button"
              onClick={() => setView(ViewState.Request)}
              className="mx-auto block text-xs underline text-muted-foreground"
              disabled={loading}
            >
              Start over
            </button>
            <Link href="/signin" className="block text-center text-xs underline">
              Back to sign in
            </Link>
          </form>
        )}

        {view === ViewState.Done && (
          <div className="space-y-4">
            <Button onClick={() => router.push("/signin")} className="w-full">
              Go to Sign In
            </Button>
          </div>
        )}
      </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-transparent">
      <Suspense fallback={<div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm text-sm text-muted-foreground">Loading...</div>}>
        <ResetPasswordInner />
      </Suspense>
    </main>
  );
}
