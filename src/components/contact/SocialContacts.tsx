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
              className="transition-transform duration-300 hover:scale-110"
            >
              <Button
                variant="default"
                size="icon"
                className={`${link.color} ${link.hoverColor} text-white transition-all duration-300`}
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
          <a 
            href="tel:+37067168860" 
            className="group flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all duration-300 ease-in-out relative"
          >
            <Phone className="h-5 w-5 transition-colors duration-300 group-hover:text-primary" />
            <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
              +370 671 68860
            </span>
          </a>
          <a 
            href="mailto:info@ponasobuolys.lt" 
            className="group flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all duration-300 ease-in-out relative"
          >
            <Mail className="h-5 w-5 transition-colors duration-300 group-hover:text-primary" />
            <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
              info@ponasobuolys.lt
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};