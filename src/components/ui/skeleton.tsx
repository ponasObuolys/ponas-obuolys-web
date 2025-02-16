import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}

export function Skeleton({
  className,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700",
        {
          "rounded-full": variant === "circular",
          "rounded-md": variant === "rectangular",
          "h-4 w-3/4 rounded": variant === "text",
        },
        className
      )}
      {...props}
    />
  )
}

// Predefined skeleton layouts
export function CardSkeleton() {
  return (
    <div className="p-4 space-y-4 border rounded-lg">
      <Skeleton className="h-32 w-full" />
      <Skeleton variant="text" className="w-2/3" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton variant="text" className="w-3/4" />
      <div className="space-y-3">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-4/5" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton variant="circular" className="h-12 w-12" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-32" />
        <Skeleton variant="text" className="w-24" />
      </div>
    </div>
  );
}
