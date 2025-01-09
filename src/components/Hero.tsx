import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <span className="inline-block animate-fadeIn opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards] px-3 py-1 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full">
          Dirbtinis Intelektas Paprasta!
        </span>
        
        <h1 className="animate-fadeIn opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards] text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          ponas Obuolys
        </h1>
        
        <p className="animate-fadeIn opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards] max-w-2xl mx-auto text-lg sm:text-xl">
          Atraskite įdomų turinį, straipsnius ir vaizdo įrašus apie dirbtinį intelektą, technologijas ir skaitmeninį gyvenimą
        </p>
      </div>
    </div>
  );
};

export default Hero;