import { Button } from "@/components/ui/button";
import { Facebook, MessageCircle, Phone, Mail, MessageSquare, Youtube, Instagram, Coffee } from "lucide-react";

export const SocialContacts = () => {
  return (
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
  );
};