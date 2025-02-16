import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimationProps {
  children: ReactNode;
  className?: string;
}

// Hover scale effect
export function HoverScale({ children, className = "" }: AnimationProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hover glow effect
export function HoverGlow({ children, className = "" }: AnimationProps) {
  return (
    <motion.div
      whileHover={{ 
        boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
        transition: { duration: 0.2 }
      }}
      className={`rounded-lg transition-shadow ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation
export function StaggerContainer({ children, className = "" }: AnimationProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item
export function StaggerItem({ children, className = "" }: AnimationProps) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Bounce animation
export function Bounce({ children, className = "" }: AnimationProps) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Pulse animation
export function Pulse({ children, className = "" }: AnimationProps) {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Floating animation with customizable parameters
export function Float({ children, className = "" }: AnimationProps) {
  return (
    <motion.div
      animate={{
        y: [0, -15, 0],
        rotate: [-1, 1, -1]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Attention-grabbing shake animation
export function Shake({ children, className = "" }: AnimationProps) {
  return (
    <motion.div
      whileHover={{
        x: [-2, 2, -2, 2, 0],
        transition: { duration: 0.4 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 3D Flip effect
export function Flip({ children, className = "" }: AnimationProps) {
  return (
    <motion.div
      whileHover={{
        rotateY: 180,
        transition: { duration: 0.6 }
      }}
      style={{ perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Magnetic hover effect
export function MagneticHover({ children, className = "" }: AnimationProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 10
        }
      }}
      whileTap={{ scale: 0.9 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Spotlight hover effect
export function SpotlightHover({ children, className = "" }: AnimationProps) {
  return (
    <motion.div
      whileHover={{
        boxShadow: "0 0 25px rgba(255, 255, 255, 0.3)",
        filter: "brightness(1.1)",
        transition: { duration: 0.2 }
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Wave text animation container
export function WaveText({ children, className = "" }: AnimationProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05
          }
        }
      }}
      className={`flex ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Wave text letter
export function WaveLetter({ children, className = "" }: AnimationProps) {
  return (
    <motion.span
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 200
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.span>
  );
} 