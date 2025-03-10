import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StreetMap from '../components/street-map';

const scrollToSection = (id: string): void => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const StrutturaIndicazioniPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      scrollToSection(location.hash.substring(1));
    } else {
      scrollToSection('hero');
    }
  }, [location]);

  return (
    <>
      {/* Contact Form Section */}
        <h2 className="text-3xl font-bold mb-8 text-center">Indicazioni</h2>
        <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg">
        {/* Map Section */}
          <div className="flex-1 p-6 h-96">
            <StreetMap />
          </div>
        </div>
    </>
  );
};


export default StrutturaIndicazioniPage;
