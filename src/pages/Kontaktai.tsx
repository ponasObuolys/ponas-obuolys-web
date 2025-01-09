import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialContacts } from "@/components/contact/SocialContacts";

const Kontaktai = () => {
  console.log("Kontaktai component rendered");
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Contact Info & Social */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">Susisiekite su manimi</h1>
              <p className="text-gray-600">
                Turite klausimų? Susisiekite su manim žemiau nurodytais kontaktais
                arba užpildykite formą.
              </p>
            </div>
            
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="/lovable-uploads/aurimas.png"
                alt="Aurimas - ponas Obuolys"
                className="object-cover w-full h-full"
              />
            </div>

            <Card className="p-6">
              <SocialContacts />
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Parašykite man</h2>
            <ContactForm />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Kontaktai;