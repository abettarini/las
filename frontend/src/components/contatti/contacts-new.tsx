import { Mail, MapPin, Phone, Printer } from "lucide-react";
import React from "react";
import ContactForm from "../ContactForm";
import StreetMapGoogle from "../street-map-google";

const ContactsNew: React.FC = () => {
  return (
      <div className="contact-section">
        {/* Top section: Contact form and Google Maps side by side */}
        <div className="contact-container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Contact form */}
            <div className="lg:w-1/2">
              <div className="contact-card p-6 h-full">
                <h3 className="contact-subheading">Inviaci un messaggio</h3>
                <ContactForm />
              </div>
            </div>

            {/* Right side: Google Maps */}
            <div className="lg:w-1/2">
              <div className="contact-card p-6 h-full">
                <h3 className="contact-subheading">Come raggiungerci</h3>
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
            <div className="contact-card p-6">
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
            </div>

            {/* Card 2: Phone */}
            <div className="contact-card p-6">
              <div className="flex items-start">
                <Phone className="contact-icon" />
                <div>
                  <p className="font-medium">Telefono</p>
                  <p className="text-muted-foreground">+39 055 8720079</p>
                </div>
              </div>
            </div>

            {/* Card 3: Fax */}
            <div className="contact-card p-6">
              <div className="flex items-start">
                <Printer className="contact-icon" />
                <div>
                  <p className="font-medium">Fax</p>
                  <p className="text-muted-foreground">+39 055 8720079</p>
                </div>
              </div>
            </div>

            {/* Card 4: Email */}
            <div className="contact-card p-6">
              <div className="flex items-start">
                <Mail className="contact-icon" />
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