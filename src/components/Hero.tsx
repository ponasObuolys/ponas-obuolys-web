import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:40px] bg-[position:center] z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px] bg-[position:center] z-0"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <span className="inline-block animate-fadeIn opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards] px-3 py-1 mb-4 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
          Dirbtinis Intelektas Paprastai!
        </span>
        
        <h1 className="animate-fadeIn opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards] text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          ponas Obuolys
        </h1>
        
        <p className="animate-fadeIn opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards] max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
          Atraskite įdomų turinį, straipsnius ir vaizdo įrašus apie dirbtinį intelektą, technologijas ir skaitmeninį gyvenimą
        </p>
      </div>
    </div>
  );
};

export default Hero;