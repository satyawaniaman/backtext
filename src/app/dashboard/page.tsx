import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/server/db";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }
  const user = await db.user.findUnique({
    where: {
      id: session.user?.id,
    },
    select: {
      credits: true,
    },
  });
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <div>
            <h1 className="mb-2 hidden text-3xl font-bold md:block">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user?.name ?? session.user?.email}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <span className="text-sm">
                Credits Left: {user?.credits ?? 0}
              </span>
            </Button>
            <Link href="/#pricing-section">
              <Button variant="outline">Buy Credits</Button>
            </Link>
            <SignOutButton />
          </div>
        </div>

        <div className="bg-card mt-8 rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b py-2">
              <span className="text-sm">Signed in successfully</span>
              <span className="text-muted-foreground text-xs">Just now</span>
            </div>
            <div className="flex items-center justify-between border-b py-2">
              <span className="text-sm">Dashboard accessed</span>
              <span className="text-muted-foreground text-xs">Just now</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Welcome to Backtext!</span>
              <span className="text-muted-foreground text-xs">Today</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
