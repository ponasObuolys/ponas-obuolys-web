import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useTheme } from '../ThemeProvider';

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navLinks: Array<{ name: string; path: string }>;
  handleLogout: () => void;
}

export const MobileNav = ({ isOpen, setIsOpen, navLinks, handleLogout }: MobileNavProps) => {
  const navigate = useNavigate();
  const session = useSession();
  const { theme, setTheme } = useTheme();

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.2,
        type: "tween",
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        type: "tween",
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 hover:bg-accent rounded-md dark:text-white text-gray-700 hover:text-gray-900 dark:hover:text-white/80"
        aria-label={isOpen ? "Uždaryti meniu" : "Atidaryti meniu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black lg:hidden"
              style={{ zIndex: 48 }}
            />

            {/* Mobile menu */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-background shadow-xl lg:hidden overflow-y-auto"
              style={{ zIndex: 49 }}
            >
              <div className="flex flex-col p-6 space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-accent rounded-md dark:text-white text-gray-700 hover:text-gray-900 dark:hover:text-white/80"
                    aria-label="Uždaryti meniu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <motion.button
                      key={link.path}
                      onClick={() => {
                        navigate(link.path);
                        setIsOpen(false);
                      }}
                      className="px-4 py-2 text-left hover:bg-accent rounded-md transition-colors dark:text-white text-gray-700 hover:text-gray-900 dark:hover:text-white/80"
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.name}
                    </motion.button>
                  ))}
                </nav>

                <div className="flex flex-col space-y-4 pt-4 border-t">
                  <button
                    onClick={toggleTheme}
                    className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
                  >
                    {theme === "dark" ? "Šviesus režimas" : "Tamsus režimas"}
                  </button>

                  {session ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      Atsijungti
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/prisijungimas");
                        setIsOpen(false);
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                    >
                      Prisijungti
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};