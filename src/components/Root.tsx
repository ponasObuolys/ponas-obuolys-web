import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { PageTransition } from "./ui/Transitions";
import { Suspense } from "react";
import { CardSkeleton } from "./ui/Skeleton";

export function Root() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<CardSkeleton />}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </Suspense>
      </main>
    </div>
  );
}

export default Root;