import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center space-x-3 text-2xl font-bold text-gray-800 dark:text-white hover:opacity-80 transition-opacity"
    >
      <img
        src="/lovable-uploads/0aa80ff9-7a2d-4961-ab31-ff1334112b79.png"
        alt="ponas Obuolys"
        className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
      />
      <span>ponas Obuolys</span>
    </Link>
  );
};