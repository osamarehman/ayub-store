import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountHeader } from "@/components/account/account-header";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is logged in
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AccountHeader user={session.user} />
      <div className="flex">
        <AccountSidebar />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
