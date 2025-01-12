import { Card } from "@/components/ui/card";
import { SocialContacts } from "@/components/contact/SocialContacts";
import { useEffect, useState } from "react";

const Kontaktai = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    // Preload the image
    const img = new Image();
    img.src = "/lovable-uploads/aurimas.webp";
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(true); // Stop showing loading state
      console.error("Failed to load image");
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Contact Info & Social */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">Susisiekite su manimi</h1>
              <p className="text-gray-600">
                Susisiekite su manim žemiau nurodytais kontaktais.
              </p>
            </div>
            
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-lg overflow-hidden">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              {!imageError ? (
                <img
                  src="/lovable-uploads/aurimas.webp"
                  alt="Aurimas - ponas Obuolys"
                  className={`object-cover w-full h-full ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-300`}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Nuotrauka nepasiekiama</span>
                </div>
              )}
            </div>

            <Card className="p-6">
              <SocialContacts />
            </Card>
          </div>

          {/* Right Column - Additional Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Apie mane</h2>
            <p className="text-gray-600">
              Sveiki! Esu Aurimas, technologijų entuziastas ir programuotojas. 
              Mano tikslas - dalintis žiniomis apie naujausias technologijas ir 
              padėti kitiems mokytis programavimo.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Kontaktai;