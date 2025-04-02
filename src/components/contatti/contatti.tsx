import ContactForm from "../ContactForm";
import StreetMap from "../street-map";
import ContactInfo from "./contact-info";

const Contatti: React.FC = () => {
    return (
        <section className="py-12" id="contatti">
            <h2 className="text-3xl font-bold mb-8 text-center">Contatti</h2>

            {/* Top section: Contact info and map */}
            <div className="container mx-auto mb-12">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <ContactInfo />
                    </div>
                    <div className="flex-1 h-[300px] lg:h-auto rounded-lg overflow-hidden shadow-sm">
                        <StreetMap />
                    </div>
                </div>
            </div>

            {/* Middle section: Contact form */}
            <div className="container mx-auto mb-12">
                <h3 className="text-2xl font-semibold mb-6 text-center">Inviaci un messaggio</h3>
                <div className="max-w-2xl mx-auto">
                    <ContactForm />
                </div>
            </div>
        </section>
    );
}

export default Contatti;