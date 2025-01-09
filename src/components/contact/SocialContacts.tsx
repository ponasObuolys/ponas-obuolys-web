import { Button } from "@/components/ui/button";
import { Facebook, MessageCircle, Phone, Mail, MessageSquare, Youtube, Instagram, Coffee } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Susisiekite su manimi</h1>
      <p className="text-gray-600 mb-8">
        Turite klausimų? Susisiekite su manim žemiau nurodytais kontaktais arba užpildykite formą.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          {/* Profile Image */}
          <div className="relative w-64 h-64 overflow-hidden rounded-full mb-8">
            <img 
              src="/lovable-uploads/aurimas.png"
              alt="Aurimas"
              className="absolute w-full h-full object-cover object-center"
            />
          </div>

          {/* Social and Contact Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Socialiniai tinklai</h3>
              <div className="flex flex-wrap gap-4">
                <a href="https://www.facebook.com/ponasObuolys.youtube" target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="icon" className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white">
                    <Facebook className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://m.me/101691029459035" target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="icon" className="bg-[#00B2FF] hover:bg-[#00B2FF]/90 text-white">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://wa.me/37067168860" target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="icon" className="bg-[#25D366] hover:bg-[#25D366]/90 text-white">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://youtube.com/@ponasObuolys?sub_confirmation=1" target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="icon" className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white">
                    <Youtube className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://www.instagram.com/ponasobuolys/" target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="icon" className="bg-[#E4405F] hover:bg-[#E4405F]/90 text-white">
                    <Instagram className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://patreon.com/ponasObuolys" target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="icon" className="bg-[#FF424D] hover:bg-[#FF424D]/90 text-white">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://buymeacoffee.com/ponasobuolys" target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="icon" className="bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black">
                    <Coffee className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Kontaktinė informacija</h3>
              <div className="space-y-3">
                <a href="tel:+37067168860" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
                  <Phone className="h-5 w-5" />
                  <span>+370 671 68860</span>
                </a>
                <a href="mailto:info@ponasobuolys.lt" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
                  <Mail className="h-5 w-5" />
                  <span>info@ponasobuolys.lt</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Parašykite man</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Vardas</label>
              <input
                type="text"
                id="name"
                placeholder="Jūsų vardas"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">El. paštas</label>
              <input
                type="email"
                id="email"
                placeholder="jusu@pastas.lt"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
              <input
                type="text"
                id="subject"
                placeholder="Žinutės tema"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Žinutė</label>
              <textarea
                id="message"
                rows={4}
                placeholder="Jūsų žinutė..."
                className="w-full p-2 border rounded-md"
              />
            </div>
            <Button type="submit" className="w-full">Siųsti</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;