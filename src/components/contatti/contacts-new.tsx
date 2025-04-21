import { Mail, MapPin, Phone, Printer } from "lucide-react";
import React from "react";
import ContactForm from "../ContactForm";
import StreetMapGoogle from "../street-map-google";

const ContactsNew: React.FC = () => {
  return (
      <div>
        {/* Top section: Contact form and Google Maps side by side */}
        <div className="container mx-auto mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Contact form */}
            <div className="lg:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                <h3 className="text-xl font-semibold mb-4">Inviaci un messaggio</h3>
                <ContactForm />
              </div>
            </div>

            {/* Right side: Google Maps */}
            <div className="lg:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                <h3 className="text-xl font-semibold mb-4">Come raggiungerci</h3>
                <div className="w-full h-[400px] rounded-lg overflow-hidden">
                  <StreetMapGoogle />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section: Four contact info cards */}
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
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
            </div>

            {/* Card 2: Phone */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Telefono</p>
                  <p className="text-muted-foreground">+39 055 8720079</p>
                </div>
              </div>
            </div>

            {/* Card 3: Fax */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <Printer className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Fax</p>
                  <p className="text-muted-foreground">+39 055 8720079</p>
                </div>
              </div>
            </div>

            {/* Card 4: Email */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">info@tsnlastrasigna.it</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ContactsNew;