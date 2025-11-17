import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-8 text-center px-4">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-5xl md:text-6xl">
          Marketing Automation Platform
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Create, automate, and orchestrate your marketing campaigns with ease.
          From event-based triggers to multi-step workflows, we have you covered.
        </p>
        <Link href="/login">
          <Button size="lg">
            Get Started
          </Button>
        </Link>
      </main>
    </div>
  );
}
