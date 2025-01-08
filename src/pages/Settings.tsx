import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Theme</h2>
            <div className="flex gap-4">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
              >
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
              >
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => setTheme("system")}
              >
                System
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;