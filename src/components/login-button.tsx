import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

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

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <Button disabled={isLoading}>
        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
        <span>Loading...</span>
      </Button>
    );
  }

  // If user is logged in, show sign out button
  if (session) {
    return (
      <Button onClick={handleSignOut} disabled={isLoading}>
        {isLoading ? "Logging out..." : "Log Out"}
      </Button>
    );
  }

  // If user is not logged in, show login link
  return (
    <Link href="/signin">
      <Button>Login</Button>
    </Link>
  );
}

export default LoginButton;
