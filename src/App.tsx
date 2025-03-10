import { lazy } from "react";
import { Helmet } from 'react-helmet';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { BadgeOrariApertura } from './components/OrariApertura';
import Footer from './components/footer';
import HamburgerMenu from './components/navigation/hamburger';
import { MainNavigation } from './components/navigation/main-nav';
import { Image } from './components/ui/image';
import { QuizProvider } from './context/quiz-context';
import './index.css';
import { metaConfig } from './metaConfig';
import Home from './pages/HomePage';

const LazyIscrizioni = lazy(() => import('./components/Iscrizioni'));
const LazyQuizPage = lazy(() => import('./pages/QuizPage'));
const LazyStoriaPage = lazy(() => import('./components/Storia'));
const LazyConsiglioDirettivoPage = lazy(() => import('./components/ConsiglioDirettivo'));
const LazyStrutturaIndicazioniPage = lazy(() => import('./pages/StrutturaIndicazioniPage'));

const App: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>{metaConfig.title}</title>
        <meta name="description" content={metaConfig.description} />
        <meta property="og:title" content={metaConfig.og.title} />
        <meta property="og:description" content={metaConfig.og.description} />
        <meta property="og:url" content={metaConfig.url} />
        <meta property="og:site_name" content={metaConfig.og.site_name} />
        <meta property="og:locale" content={metaConfig.og.locale} />
        <meta property="og:type" content={metaConfig.og.type} />
        {/* <meta property="fb:app_id" content={metaConfig.og.fb_app_id} /> */}
        {/* <meta property="og:image" content="http://www.asdad.it”/> */}
      </Helmet>
    <Router>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
          <Link to="#" className="hidden lg:flex">
            <Image src='/assets/las-logo.png' height={32} width={32} alt="Logo TSN Lastra a Signa" />
            <span className="sr-only">Acme Inc</span>
          </Link>
            <HamburgerMenu />
            <MainNavigation />
            <div className="flex-1" />
            <BadgeOrariApertura />
          </div>
        </header>

        <main className="container mx-auto px-0 py-4" id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/iscrizioni" element={<LazyIscrizioni />} />
            <Route path="/quiz" element={<QuizProvider><LazyQuizPage numQuestions={15} /></QuizProvider>} />
            <Route path="/chisiamo/storia" element={<div className="flex-1 p-6"><LazyStoriaPage /></div>} />
            <Route path="/chisiamo/consiglio-direttivo" element={<div className="flex-1 p-6"><LazyConsiglioDirettivoPage /></div>} />
            <Route path="/struttura/dove-siamo" element={<div className="flex-1 p-6"><LazyStrutturaIndicazioniPage /></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </div>
  );
}

export default App;
