import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSpinner = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <Skeleton className="h-96 w-full rounded-lg" />
      <Skeleton className="h-12 w-3/4" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
};