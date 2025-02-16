import { motion } from "framer-motion";
import { Skeleton } from "./skeleton";

// Navigacijos loading state
export function NavigationSkeleton() {
  return (
    <div className="h-16 border-b flex items-center px-4">
      <div className="flex items-center space-x-8 w-full">
        <Skeleton variant="rectangular" className="h-8 w-32" />
        <div className="flex-1 flex justify-center space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="text" className="w-24" />
          ))}
        </div>
        <Skeleton variant="circular" className="h-8 w-8" />
      </div>
    </div>
  );
}

// Komentarų sekcijos loading
export function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton variant="circular" className="h-10 w-10 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-32" />
            <Skeleton variant="text" className="w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Įrankių grid loading
export function ToolsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 border rounded-lg space-y-3"
        >
          <Skeleton variant="rectangular" className="h-40 w-full rounded-lg" />
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
          <div className="flex space-x-2">
            <Skeleton variant="text" className="w-16" />
            <Skeleton variant="text" className="w-16" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Video player loading
export function VideoPlayerSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="rectangular" className="w-full aspect-video rounded-lg" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <div className="flex items-center space-x-4">
          <Skeleton variant="circular" className="h-10 w-10" />
          <Skeleton variant="text" className="w-32" />
        </div>
      </div>
      <div className="flex space-x-2">
        <Skeleton variant="rectangular" className="h-8 w-20 rounded" />
        <Skeleton variant="rectangular" className="h-8 w-20 rounded" />
      </div>
    </div>
  );
}

// Statistikos kortelių loading
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 border rounded-lg"
        >
          <Skeleton variant="text" className="w-16 mb-2" />
          <Skeleton variant="rectangular" className="h-8 w-24" />
        </motion.div>
      ))}
    </div>
  );
}

// Produkto kortelės loading
export function ProductCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 border rounded-lg space-y-3"
    >
      <Skeleton variant="rectangular" className="h-48 w-full rounded-lg" />
      <Skeleton variant="text" className="w-2/3" />
      <Skeleton variant="text" className="w-1/3" />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-24" />
        <Skeleton variant="rectangular" className="h-8 w-24 rounded" />
      </div>
    </motion.div>
  );
}

// Galerijos loading
export function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <Skeleton variant="rectangular" className="w-full aspect-square rounded-lg" />
        </motion.div>
      ))}
    </div>
  );
}

// Blog post loading
export function BlogPostSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Skeleton variant="rectangular" className="w-full h-64 rounded-lg" />
      <Skeleton variant="text" className="w-3/4 h-8" />
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="space-y-2">
          <Skeleton variant="text" className="w-32" />
          <Skeleton variant="text" className="w-24" />
        </div>
      </div>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} variant="text" className="w-full" />
      ))}
    </div>
  );
}

// Testimonial loading
export function TestimonialSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 border rounded-lg space-y-4"
    >
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" className="h-16 w-16" />
        <div className="space-y-2">
          <Skeleton variant="text" className="w-32" />
          <Skeleton variant="text" className="w-24" />
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} variant="text" className="w-full" />
        ))}
      </div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="circular" className="h-4 w-4" />
        ))}
      </div>
    </motion.div>
  );
}

// Timeline loading
export function TimelineSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex">
          <div className="flex flex-col items-center mr-4">
            <Skeleton variant="circular" className="h-8 w-8" />
            <div className="h-full w-0.5 bg-gray-200 my-2" />
          </div>
          <div className="flex-1 space-y-3 pt-1">
            <Skeleton variant="text" className="w-32" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
} 