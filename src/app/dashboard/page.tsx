import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/server/db";
import BacktextCreator from "@/components/backtext-creator";

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
            <Button variant="outline">
              <span className="text-sm">
                Credits Left: {user?.credits ?? 0}
              </span>
            </Button>
            <Link href="/buy-credits">
              <Button variant="outline">Buy Credits</Button>
            </Link>
            <Link href="/account">
              <Button variant="outline">Account</Button>
            </Link>
          </div>
        </div>

        {user?.credits === 0 ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Hi {session.user?.name ?? session.user?.email},
            </h1>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Keep creating images?
            </h1>
            <div className="mt-6 flex flex-col items-center gap-4">
              <p className="text-muted-foreground max-w-md leading-7">
                Subscribe to pro plan to keep creating images only for $3/month.
              </p>
              <Link href="/buy-credits">
                <Button size="lg">Buy credits</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex min-h-[60vh] max-w-5xl justify-center md:mt-24">
            <BacktextCreator />
          </div>
        )}
      </div>
    </main>
  );
}
