import ContactForm from "../ContactForm";
import StreetMap from "../street-map";

const Contatti: React.FC = () => {
    return (
        <section className="py-12" id="contatti">
            <h2 className="text-3xl font-bold mb-8 text-center">Contatti</h2>
            <div className="flex flex-col lg:flex-row bg-white">
            {/* Map Section */}
            <div className="flex-1">
                <ContactForm />
            </div>
            <div className="flex-1 p-6">
                <StreetMap />
                </div>
            </div>
        </section>
    );
}

export default Contatti;