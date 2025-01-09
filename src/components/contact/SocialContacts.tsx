import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";
import { socialLinks, supportLinks } from "@/constants/socialLinks";

export const SocialContacts = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Socialiniai tinklai</h3>
        <div className="flex flex-wrap gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="default"
                size="icon"
                className={`${link.color} ${link.hoverColor} text-white`}
              >
                <link.icon className="h-5 w-5" />
              </Button>
            </a>
          ))}
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