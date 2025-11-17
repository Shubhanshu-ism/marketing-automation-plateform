'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { withAuth } from "@/components/auth/withAuth";
import Link from "next/link";

function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-zinc-50 dark:bg-black">
      <header className="w-full max-w-5xl flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard/flows">
            <Button variant="link">Flows</Button>
          </Link>
          <Link href="/dashboard/campaigns">
            <Button variant="link">Campaigns</Button>
          </Link>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center w-full max-w-5xl mt-8">
        <p>Welcome to your dashboard. Campaign management features will be here.</p>
      </main>
    </div>
  );
}

export default withAuth(DashboardPage);
