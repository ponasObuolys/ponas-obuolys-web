import { Button } from "@/components/ui/button";
import { Facebook, MessageCircle, Phone, Mail, WhatsApp } from "lucide-react";

export const SocialContacts = () => {
  const socials = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/ponasObuolys.youtube",
      icon: <Facebook className="h-5 w-5" />,
      color: "bg-[#1877F2] hover:bg-[#1877F2]/90",
    },
    {
      name: "Messenger",
      url: "https://m.me/101691029459035",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-[#00B2FF] hover:bg-[#00B2FF]/90",
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/37067168860",
      icon: <WhatsApp className="h-5 w-5" />,
      color: "bg-[#25D366] hover:bg-[#25D366]/90",
    },
  ];

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      text: "+370 671 68860",
      href: "tel:+37067168860",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      text: "info@ponasobuolys.lt",
      href: "mailto:info@ponasobuolys.lt",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Socialiniai tinklai</h3>
        <div className="flex gap-4">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="default"
                size="icon"
                className={`${social.color} text-white`}
              >
                {social.icon}
              </Button>
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Kontaktinė informacija</h3>
        <div className="space-y-3">
          {contactInfo.map((contact) => (
            <a
              key={contact.text}
              href={contact.href}
              className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {contact.icon}
              <span>{contact.text}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};