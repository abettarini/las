import ContactForm from "../ContactForm";
import StreetMapGoogle from "../street-map-google";
import ContactInfo from "./contact-info";

const Contatti: React.FC = () => {
    return (
        <section className="contact-section" id="contatti">
            <h2 className="contact-heading">Contatti</h2>

            {/* Top section: Contact info and contact form side by side */}
            <div className="contact-container">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left side: Contact form */}
                    <div className="lg:w-1/2 contact-card p-6">
                        <h3 className="contact-subheading">Inviaci un messaggio</h3>
                        <ContactForm />
                    </div>

                    {/* Right side: Contact info */}
                    <div className="lg:w-1/2">
                        <ContactInfo />
                    </div>
                </div>
            </div>

            {/* Bottom section: Map */}
            <div className="container mx-auto">
                <h3 className="contact-subheading">Come raggiungerci</h3>
                <div className="contact-map-container">
                    <StreetMapGoogle />
                </div>
            </div>
        </section>
    );
}

export default Contatti;