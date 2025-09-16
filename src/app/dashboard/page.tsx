import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user?.name ?? session.user?.email}!
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="mb-2 text-lg font-semibold">Profile Information</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {session.user?.name ?? "Not provided"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {session.user?.email}
              </p>
              <p>
                <span className="font-medium">User ID:</span> {session.user?.id}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h2 className="mb-2 text-lg font-semibold">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                View Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Help & Support
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h2 className="mb-2 text-lg font-semibold">Session Details</h2>
            <div className="bg-muted max-h-32 overflow-auto rounded p-3 text-xs">
              <pre>{JSON.stringify(session, null, 2)}</pre>
            </div>
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
