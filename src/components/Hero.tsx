import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:40px] bg-[position:center] z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px] bg-[position:center] z-0"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <span className="inline-block animate-fadeIn opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards] px-3 py-1 mb-4 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
          Dirbtinis Intelektas Paprastai!
        </span>
        
        <h1 className="animate-fadeIn opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards] text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          ponas Obuolys
        </h1>
        
        <p className="animate-fadeIn opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards] max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-8">
          Atraskite įdomų turinį, straipsnius ir vaizdo įrašus apie dirbtinį intelektą, technologijas ir skaitmeninį gyvenimą
        </p>
        
        <div className="animate-fadeIn opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards] flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/videos"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
          >
            Žiūrėti vaizdo įrašus
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          
          <Link
            to="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Skaityti blogą
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;