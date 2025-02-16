import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface ProgressBarProps {
  isLoading?: boolean;
  color?: string;
  height?: number;
}

export function ProgressBar({
  isLoading = true,
  color = "#3B82F6",
  height = 2
}: ProgressBarProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (isLoading) {
      controls.start({
        width: ["0%", "30%", "60%", "80%", "100%"],
        transition: {
          duration: 1.5,
          ease: "easeInOut",
          times: [0, 0.2, 0.4, 0.6, 1]
        }
      });
    } else {
      controls.set({ width: "100%" });
    }
  }, [isLoading, controls]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50"
      style={{ height }}
    >
      <motion.div
        className="h-full"
        style={{ backgroundColor: color }}
        initial={{ width: "0%" }}
        animate={controls}
      />
    </motion.div>
  );
}

// Loading indikatorius su procentais
export function CircularProgress({
  progress = 0,
  size = 40,
  strokeWidth = 4,
  color = "#3B82F6"
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dash = (progress * circumference) / 100;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Fono apskritimas */}
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress apskritimas */}
        <motion.circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
        {Math.round(progress)}%
      </div>
    </div>
  );
} 