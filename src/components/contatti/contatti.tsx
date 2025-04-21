import ContactForm from "../ContactForm";
import StreetMapGoogle from "../street-map-google";
import ContactInfo from "./contact-info";

const Contatti: React.FC = () => {
    return (
        <section className="py-12" id="contatti">
            <h2 className="text-3xl font-bold mb-8 text-center">Contatti</h2>

            {/* Top section: Contact info and contact form side by side */}
            <div className="container mx-auto mb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left side: Contact info */}
                    <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Inviaci un messaggio</h3>
                        <ContactForm />
                    </div>

                    {/* Right side: Contact form */}
                    
                    <div className="lg:w-1/2">
                        <ContactInfo />
                    </div>
                </div>
            </div>

            {/* Bottom section: Map */}
            <div className="container mx-auto">
                <h3 className="text-xl font-semibold mb-4">Come raggiungerci</h3>
                <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-sm">
                    <StreetMapGoogle />
                </div>
            </div>
        </section>
    );
}

export default Contatti;