'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { withAuth } from "@/components/auth/withAuth";

function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center p-24 bg-zinc-50 dark:bg-black">
      <header className="w-full max-w-5xl flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center w-full max-w-5xl mt-8">
        <p>Welcome to your dashboard. Campaign management features will be here.</p>
      </main>
    </div>
  );
}

export default withAuth(DashboardPage);
