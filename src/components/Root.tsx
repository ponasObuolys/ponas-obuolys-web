import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { PageTransition } from "./ui/Transitions";
import { Suspense, useState, useEffect } from "react";
import { NavigationSkeleton } from "./ui/SpecialLoadingStates";
import { ProgressBar } from "./ui/ProgressBar";

export function Root() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simuliuojame puslapio užkrovimą
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <ProgressBar isLoading={isLoading} />
      <Suspense fallback={<NavigationSkeleton />}>
        <Navigation />
      </Suspense>
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<NavigationSkeleton />}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </Suspense>
      </main>
    </div>
  );
}

export default Root;