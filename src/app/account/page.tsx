import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { AccountTabs } from "@/components/account-tabs";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your account settings and preferences.",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const user = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      credits: true,
      plan: true,
    },
  });

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <AccountTabs user={user} />
    </div>
  );
}
