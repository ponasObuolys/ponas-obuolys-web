import { useYoutubeStats } from "@/hooks/useYoutubeStats";
import { Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const AnimatedCounter = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const finalValue = parseInt(value);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = finalValue / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep === steps) {
        setDisplayValue(finalValue.toLocaleString());
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(stepValue * currentStep).toLocaleString());
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span className="font-bold">{displayValue}</span>;
};

export const Hero = () => {
  const { data: youtubeStats, isLoading, error } = useYoutubeStats();

  return (
    <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-yellow-300 dark:bg-yellow-700 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center space-y-8">
        <span className="inline-block animate-fadeIn opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards] px-3 py-1 mb-2 text-sm font-medium bg-primary/10 text-primary rounded-full">
          Dirbtinis Intelektas Paprastai
        </span>
        
        <h1 className="animate-fadeIn opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards] text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          ponas Obuolys
        </h1>
        
        <p className="animate-fadeIn opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards] max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
          Atraskite įdomų turinį, straipsnius ir vaizdo įrašus apie dirbtinį intelektą, technologijas ir skaitmeninį gyvenimą
        </p>

        {/* YouTube Stats Section */}
        <div className="animate-fadeIn opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards] mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {isLoading ? (
            <div className="col-span-3 flex justify-center">
              <div className="animate-pulse w-64 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ) : error ? (
            <div className="col-span-3 text-red-500">Nepavyko užkrauti statistikos</div>
          ) : (
            <>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Prenumeratoriai</h3>
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={youtubeStats?.subscriberCount || "0"} />
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Peržiūros</h3>
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={youtubeStats?.viewCount || "0"} />
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Video</h3>
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={youtubeStats?.videoCount || "0"} />
                </p>
              </div>
            </>
          )}
        </div>

        {/* CTA Button */}
        <div className="animate-fadeIn opacity-0 [animation-delay:1000ms] [animation-fill-mode:forwards] mt-8">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-300"
            onClick={() => window.open("https://youtube.com/@ponasObuolys?sub_confirmation=1", "_blank")}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Youtube className="w-5 h-5" />
              Prenumeruoti
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-hover to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </div>
      </div>
    </div>
  );
};