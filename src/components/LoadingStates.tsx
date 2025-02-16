import { motion } from "framer-motion";
import { CardSkeleton, BlogPostSkeleton, ProfileSkeleton } from "./ui/Skeleton";

export function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Prašome palaukti...
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ContentLoader({ type = "card", count = 1 }) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {items.map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {type === "card" && <CardSkeleton />}
          {type === "blog" && <BlogPostSkeleton />}
          {type === "profile" && <ProfileSkeleton />}
        </motion.div>
      ))}
    </div>
  );
}

export function LoadingButton({
  loading,
  children,
  className = "",
  ...props
}: {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <button
      className={`relative inline-flex items-center justify-center ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-inherit"
        >
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      <span className={loading ? "opacity-0" : "opacity-100"}>{children}</span>
    </button>
  );
} 