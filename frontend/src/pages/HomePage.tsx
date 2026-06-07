import AdBanner, { BannerProps } from '@/components/ad-banner';
import { ContactsNew } from '@/components/contatti';
import DimaCTA from '@/components/dima-cta';
import FAQ from "@/components/faq/faq";
import NewsList, { Content } from '@/components/news/news-list';
import PlantsComponent from '@/components/plants-component';
import ServiceCard, { services } from '@/components/ServiceCard';
import { DirectorHomeCalendar } from '@/components/turni/director-home-calendar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { useAuth } from '@/context/auth-context';
import plantsData from '@/data/plants.json';
import { getAllNews } from '@/services/news-service';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useLocation } from 'react-router-dom';

const scrollToSection = (id: string): void => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const banners: BannerProps[] = [
  { id: "1", title: "Armeria Innocenti", imageUrl: "/assets/armeria-innocenti.png", ctaText: "Visita", link: "https://armeriainnocenti.it/" },
  { id: "2", title: "Extrema Ratio", imageUrl: "/assets/extrema-ratio.png", ctaText: "Visita", link: "https://extremaratio.com/" },
  { id: "3", title: "Armeria Paoletti", imageUrl: "/assets/armeria-paoletti.png", ctaText: "Visita", link: "https://armeriapaoletti.it/" },
]

const Home: React.FC = () => {
  const location = useLocation();
  const { user, hasRole } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const isDirector = user && hasRole('ROLE_DIRECTOR');

  useEffect(() => {
    getAllNews().then((response) => {
      console.log(response.data); // Log the fetched news to the console
      setContents(response.data || []);
    }).catch((error) => {
      console.error(error);
    });
  }, [])

  useEffect(() => {
    if (location.hash) {
      scrollToSection(location.hash.substring(1));
    } else {
      scrollToSection(isDirector ? 'director-calendar' : 'hero');
    }
  }, [location, isDirector]);

  return (
    <>
      <Helmet>
        <meta property="og:title" content="Home" />
      </Helmet>
      {isDirector ? (
        /* Director Calendar Section */
        <section id="director-calendar" className="relative py-12 overflow-hidden bg-background">
          <div className="container mx-auto px-4">
            <DirectorHomeCalendar />
          </div>
        </section>
      ) : (
        /* Hero Section */
        <section id="hero" className="relative py-20 overflow-hidden bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-6">
                <h1 className="text-5xl font-bold leading-tight">
                  Benvenuti al<br />
                  <span className="text-primary">TSN Lastra a Signa</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                Lo scopo della nostra associazione e' l'insegnamento e l'addestramento al maneggio delle armi consapevole e in sicurezza; mediante corsi di formazione dedicati a Polizia Municipale, Guardie Giurate, corpi armati istituzionali e civili.

  Troverete un punto di ritrovo dove poter scambiare idee, nozioni ed esperienze in un clima sereno.

   
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Button size="lg" onClick={() => scrollToSection('servizi')}>
                    Scopri i Nostri Servizi
                  </Button>
                  <Button size="lg" variant="secondary" onClick={() => scrollToSection('dima-corso')}>
                    Corso DIMA
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => scrollToSection('contatti')}>
                    Contattaci
                  </Button>
                </div>
                <div className="pt-6 flex gap-8">
                  <div>
                    <div className="text-2xl font-bold">1884</div>
                    <div className="text-muted-foreground">Data di nascita</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">3500+</div>
                    <div className="text-muted-foreground">Membri Attivi</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-muted-foreground">Categoria</div>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  {/* Placeholder for hero image */}
                  <Image width={700} height={400} src="/assets/poligono.jpg" alt="Hero Image" className="object-cover object-center"/>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-12" id="servizi">
        <div className="grid grid-cols-1 mx-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      {/* News Section */}
      <section className="py-12" id="news">
        <h2 className="text-3xl font-bold mb-8 text-center">Comunicazioni della Segreteria</h2>
        <NewsList contents={contents} itemsPerPage={3}/>
      </section>

      {/* DIMA Course CTA Section */}
      <section className="py-12" id="dima-corso">
        <div className="container mx-auto px-4">
          <DimaCTA 
            title="Corso DIMA - Diploma di Idoneità al Maneggio Armi" 
            description="Partecipa al nostro corso per otttenere il Diploma di Idoneità al . Impara le tecniche di tiro e la gestione sicura delle armi con i nostri istruttori qualificati."
            buttonText="Prenota il tuo posto ora"
            className="shadow-lg"
          />
        </div>
      </section>

      <section className="py-12" id="impianti">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-10">
            <PlantsComponent plants={plantsData} />
          </div>
        </div>
      </section>
      {/* Contact Form Section */}
      <section className="py-12 mx-4" id="contatti">
        <Card className="border border-gray-200 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 pt-4 pb-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Contatti</h2>
        <ContactsNew />
        </Card>
      </section>

      <FAQ />
      {/* Ad Banners */}
      <section className="py-12" id="banner">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <AdBanner key={banner.id} {...banner}/>
          ))}
        </div>
      </section>
    </>
  );
};


export default Home;
