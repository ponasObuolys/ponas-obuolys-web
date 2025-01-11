export const Hero = () => {
  return (
    <div className="relative min-h-[25vh] flex items-center justify-center">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <span className="inline-block animate-fadeIn opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards] px-2 py-0.5 mb-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
          Dirbtinis Intelektas Paprastai
        </span>
        
        <h1 className="animate-fadeIn opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards] text-xl sm:text-2xl md:text-3xl font-bold mb-2">
          ponas Obuolys
        </h1>
        
        <p className="animate-fadeIn opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards] max-w-xl mx-auto text-sm sm:text-base">
          Atraskite įdomų turinį, straipsnius ir vaizdo įrašus apie dirbtinį intelektą, technologijas ir skaitmeninį gyvenimą
        </p>
      </div>
    </div>
  );
};