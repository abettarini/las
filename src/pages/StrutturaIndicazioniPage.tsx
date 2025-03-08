import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BannerProps } from '../components/ad-banner';
import StreetMap from '../components/street-map';

const scrollToSection = (id: string): void => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const banners: BannerProps[] = [
  { id: "1", title: "Armeria Innocenti", imageUrl: "/src/assets/armeria-innocenti.png", ctaText: "Visita", link: "https://armeriainnocenti.it/" },
  { id: "2", title: "Extrema Ratio", imageUrl: "/src/assets/extrema-ratio.png", ctaText: "Visita", link: "https://extremaratio.com/" },
  { id: "3", title: "Armeria Paoletti", imageUrl: "/src/assets/armeria-paoletti.png", ctaText: "Visita", link: "https://armeriapaoletti.it/" },
]

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
