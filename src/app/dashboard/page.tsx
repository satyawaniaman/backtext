import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BacktextCreator from "@/components/backtext-creator";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <main className="container mx-auto flex min-h-screen flex-col px-4 py-8 md:py-16">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 flex flex-col items-start gap-3 md:flex-row md:justify-between">
          <div className="text-left">
            <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user?.name ?? session.user?.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
            <Link href="/account">
              <Button variant="outline">Account</Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto flex min-h-[60vh] max-w-5xl justify-center md:mt-8">
          <BacktextCreator />
        </div>
      </div>
    </main>
  );
}
