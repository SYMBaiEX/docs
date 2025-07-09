import Link from "next/link";
import { Cards, Card } from "fumadocs-ui/components/card";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            ElizaOS Documentation
          </h1>
          <p className="text-xl text-fd-muted-foreground">
            Build intelligent AI agents with the most flexible agent framework
          </p>
        </div>

        <Cards>
          <Card
            title="Getting Started"
            description="Create your first ElizaOS agent in minutes"
            href="/docs/getting-started"
          />
          <Card
            title="Core Concepts"
            description="Understand the fundamental architecture and concepts"
            href="/docs/core-concepts"
          />
          <Card
            title="Plugins"
            description="Extend your agents with powerful integrations"
            href="/docs/plugins"
          />
          <Card
            title="API Reference"
            description="Complete reference for all APIs and interfaces"
            href="/docs/api-reference"
          />
        </Cards>

        <div className="space-y-4 border bg-fd-card p-6">
          <h2 className="text-2xl font-semibold">Quick Links</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href="/docs/getting-started/quickstart"
              className="border bg-fd-background p-4 transition-colors hover:bg-fd-accent"
            >
              <h3 className="font-medium">Quickstart Guide</h3>
              <p className="text-sm text-fd-muted-foreground">
                Build your first agent in 5 minutes
              </p>
            </Link>
            <Link
              href="/docs/learning-tracks"
              className="border bg-fd-background p-4 transition-colors hover:bg-fd-accent"
            >
              <h3 className="font-medium">Learning Tracks</h3>
              <p className="text-sm text-fd-muted-foreground">
                Guided paths for different skill levels
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
