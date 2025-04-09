import Contatti from "@/components/contatti/contatti";
import FAQ from "@/components/faq/faq";

const ContattiFaqPage: React.FC = () => {
	return (
		<div className="container mx-auto px-4">
            {/* Contact section */}
            <Contatti />

            {/* FAQ section */}
            <div className="py-12 border-t border-gray-200">
                <h2 className="text-3xl font-bold mb-8 text-center">Domande Frequenti</h2>
                <div className="max-w-4xl mx-auto">
                    <FAQ />
                </div>
            </div>
		</div>
	);
}

export default ContattiFaqPage;