import { Mail, MapPin, Phone, Printer } from "lucide-react";
import React from "react";

const ContactInfo: React.FC = () => {
  return (
    <div className="contact-card p-6">
      <h3 className="contact-subheading">Informazioni di contatto</h3>
      <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-start">
          <MapPin className="contact-icon" />
          <div>
            <p className="font-medium">Indirizzo</p>
            <p className="text-muted-foreground">
              Via del Tiro a Segno, 1<br />
              50055 Lastra a Signa (FI)
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Phone className="contact-icon" />
          <div>
            <p className="font-medium">Telefono</p>
            <p className="text-muted-foreground">+39 055 8720079</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Printer className="contact-icon" />
          <div>
            <p className="font-medium">Fax</p>
            <p className="text-muted-foreground">+39 055 8720079</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Mail className="contact-icon" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">info@tsnlastrasigna.it</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;