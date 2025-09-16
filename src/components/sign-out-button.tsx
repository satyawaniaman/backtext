"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={isLoading}>
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
          <span>Signing out...</span>
        </>
      ) : (
        "Sign Out"
      )}
    </Button>
  );
}
