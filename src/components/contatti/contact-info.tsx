import { Mail, MapPin, Phone, Printer } from "lucide-react";
import React from "react";

const ContactInfo: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Informazioni di contatto</h3>
      <div className="space-y-4">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
          <div>
            <p className="font-medium">Indirizzo</p>
            <p className="text-muted-foreground">
              Via del Tiro a Segno, 1<br />
              50055 Lastra a Signa (FI)
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
          <div>
            <p className="font-medium">Telefono</p>
            <p className="text-muted-foreground">+39 055 8720079</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Printer className="h-5 w-5 text-primary mr-3 mt-0.5" />
          <div>
            <p className="font-medium">Fax</p>
            <p className="text-muted-foreground">+39 055 8720079</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
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