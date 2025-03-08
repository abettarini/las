import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ConsiglioDirettivoPage from './components/ConsiglioDirettivo';
import Iscrizioni2 from './components/Iscrizioni2';
import StoriaPage from './components/Storia';
import Footer from './components/footer';
import HamburgerMenu from './components/navigation/hamburger';
import { MainNavigation } from './components/navigation/main-nav';
import { Image } from './components/ui/image';
import { QuizProvider } from './context/quiz-context';
import './index.css';
import Home from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import StrutturaIndicazioniPage from './pages/StrutturaIndicazioniPage';


const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
          <Link to="#" className="hidden lg:flex">
            <Image src='/assets/las-logo.png' height={32} width={32} alt="Logo TSN Lastra a Signa" />
            <span className="sr-only">Acme Inc</span>
          </Link>
            <MainNavigation />
            <HamburgerMenu />
          </div>
        </header>

        <main className="container mx-auto px-0 py-4" id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/iscrizioni" element={<Iscrizioni2 />} />
            <Route path="/quiz" element={<QuizProvider><QuizPage numQuestions={15} /></QuizProvider>} />
            <Route path="/chisiamo/storia" element={<div className="flex-1 p-6"><StoriaPage /></div>} />
            <Route path="/chisiamo/consiglio-direttivo" element={<div className="flex-1 p-6"><ConsiglioDirettivoPage /></div>} />
            <Route path="/struttura/dove-siamo" element={<div className="flex-1 p-6"><StrutturaIndicazioniPage /></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
