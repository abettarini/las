import { AuthButton } from '@/components/auth/AuthButton';
import Footer from '@/components/footer';
import { InstallButton } from '@/components/InstallButton';
import HamburgerMenu from '@/components/navigation/hamburger';
import { MainNavigation } from '@/components/navigation/main-nav';
import { BadgeOrariApertura } from '@/components/OrariApertura';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Image } from '@/components/ui/image';
import { EnvironmentRibbon } from '@/components/ui/ribbon';
import { Toaster } from '@/components/ui/sonner';
import { lazy, Suspense } from "react";
import { Helmet } from 'react-helmet-async';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/auth-context';
import { QuizProvider } from './context/quiz-context';
import './index.css';
import { metaConfig } from './metaConfig';
import Home from './pages/HomePage';
import ImpiantiPage from "./pages/ImpiantiPage";

const LazyIscrizioni = lazy(() => import('@/components/Iscrizioni'));
const LazyQuizPage = lazy(() => import('./pages/QuizPage'));
const LazyStoriaPage = lazy(() => import('@/components/Storia'));
const LazyConsiglioDirettivoPage = lazy(() => import('./pages/ConsiglioDirettivoPage'));
const LazyStrutturaIndicazioniPage = lazy(() => import('./pages/StrutturaIndicazioniPage'));
const LazyBilanciPage = lazy(() => import('./pages/BilanciPage'));
const LazyBookingPage = lazy(() => import('./pages/BookingPage'));
const LazyOrariPage = lazy(() => import('./pages/OrariPage'));
const LazyPrezziPage = lazy(() => import('./pages/PrezziPage'));
const LazyArmeriaPage = lazy(() => import('./pages/ArmeriaPage'));
const LazyDocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const LazyCancelBookingPage = lazy(() => import('./pages/CancelBookingPage'));
const LazyRegisterPage = lazy(() => import('./pages/RegisterPage'));
const LazyLoginPage = lazy(() => import('./pages/LoginPage'));
const LazyVerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const LazyAuthenticationPage = lazy(() => import('./pages/AuthenticationPage'));
const LazyGoogleCallbackPage = lazy(() => import('./pages/GoogleCallback'));
const LazyProfilePage = lazy(() => import('./pages/ProfilePage'));
const LazyUserBookingPage = lazy(() => import('./pages/UserBookingPage'));
const LazySettingsPage = lazy(() => import('./pages/account/settings'));
const LazyUserLayout = lazy(() => import('./layouts/UserLayout'));
const LazyAdminLayout = lazy(() => import('./layouts/AdminLayout'));
const LazyAdminDashboard = lazy(() => import('./pages/admin'));
const LazyUserManagement = lazy(() => import('./pages/admin/UserManagement'));
const LazyNewsManagement = lazy(() => import('./pages/admin/NewsManagement').then(module => ({ default: module.NewsManagement })));
const LazyBookingManagement = lazy(() => import('./pages/admin/BookingManagement').then(module => ({ default: module.BookingManagement })));
const LazyTurniManagement = lazy(() => import('./pages/admin/TurniManagement').then(module => ({ default: module.TurniManagement })));
const LazyTurniPage = lazy(() => import('./pages/account/TurniPage'));

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


      {/* Ribbon per ambiente di sviluppo */}
      <EnvironmentRibbon />

    <Router>
      <ThemeProvider 
        defaultTheme="system" 
        defaultColorScheme="white"
        storageKeyTheme="tsn-las-ui-theme" 
        storageKeyColorScheme="tsn-las-ui-color-scheme"
      >
        <AuthProvider>
          <div className="min-h-screen bg-background">
            {/* Header */}
            <header role="banner" className="sticky top-0 z-50 w-full border-b bg-header backdrop-blur supports-[backdrop-filter]:bg-header/90">
              <div className="container flex h-16 items-center">
              <Link to="/" className="hidden lg:flex">
                <Image src='/assets/las-logo.png' height={32} width={32} alt="Logo TSN Lastra a Signa" />
                <span className="sr-only">Acme Inc</span>
              </Link>
                <HamburgerMenu />
                <MainNavigation />
                <div className="flex-1" />
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <BadgeOrariApertura />
                  <AuthButton />
                </div>
              </div>
            </header>

          <main className="container mx-auto px-0 py-4" id="main">
            <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/iscrizioni" element={<LazyIscrizioni />} />
                <Route path="/quiz" element={<QuizProvider><LazyQuizPage numQuestions={15} /></QuizProvider>} />
                <Route path="/chisiamo/storia" element={<div className="flex-1 p-6"><LazyStoriaPage /></div>} />
                <Route path="/chisiamo/consiglio-direttivo" element={<div className="flex-1 p-6"><LazyConsiglioDirettivoPage /></div>} />
                <Route path="/struttura/impianti" element={<div className="flex-1 p-6"><ImpiantiPage /></div>} />
                <Route path="/struttura/dove-siamo" element={<div className="flex-1 p-6"><LazyStrutturaIndicazioniPage /></div>} />
                <Route path="/struttura/prezzi" element={<div className="flex-1 p-6"><LazyPrezziPage /></div>} />
                <Route path="/struttura/armeria" element={<div className="flex-1 p-6"><LazyArmeriaPage /></div>} />
                <Route path="/documenti" element={<div className="flex-1 p-6"><LazyDocumentsPage /></div>} />
                <Route path="/annulla-prenotazione/:id" element={<div className="flex-1 p-6"><LazyCancelBookingPage /></div>} />
                <Route path="/prenotazioni" element={<div className="flex-1 p-6"><LazyBookingPage /></div>} />
                <Route path="/struttura/orari" element={<div className="flex-1 p-6"><LazyOrariPage /></div>} />
                <Route path="/chisiamo/bilanci" element={<div className="flex-1 p-6"><LazyBilanciPage /></div>} />

                {/* Nuove rotte per l'autenticazione */}
                <Route path="/registrazione" element={<div className="flex-1 p-6"><LazyRegisterPage /></div>} />
                <Route path="/login" element={<div className="flex-1 p-6"><LazyLoginPage /></div>} />
                <Route path="/verifica-email" element={<div className="flex-1 p-6"><LazyVerifyEmailPage /></div>} />
                <Route path="/autenticazione" element={<div className="flex-1 p-6"><LazyAuthenticationPage /></div>} />
                <Route path="/auth/google/callback" element={<div className="flex-1 p-6"><LazyGoogleCallbackPage /></div>} />
                {/* Rotte account utente con layout condiviso */}
                <Route path="/account" element={<LazyUserLayout />}>
                  <Route path="profilo" element={<LazyProfilePage />} />
                  <Route path="prenotazioni" element={<LazyUserBookingPage />} />
                  <Route path="impostazioni" element={<LazySettingsPage />} />
                  <Route path="turni" element={<LazyTurniPage />} />
                </Route>

                {/* Rotte per l'amministrazione */}
                <Route path="/admin" element={<LazyAdminLayout />}>
                  <Route index element={<LazyAdminDashboard />} />
                  <Route path="users" element={<LazyUserManagement />} />
                  <Route path="news" element={<LazyNewsManagement />} />
                  <Route path="bookings" element={<LazyBookingManagement />} />
                  <Route path="turni" element={<LazyTurniManagement />} />
                </Route>

                {/* Manteniamo temporaneamente le vecchie rotte per retrocompatibilità */}
                <Route path="/profilo" element={<div className="flex-1 p-6"><LazyProfilePage /></div>} />
                <Route path="/prenotazioni-utente" element={<div className="flex-1 p-6"><LazyUserBookingPage /></div>} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
        <Toaster />
        <InstallButton />
      </AuthProvider>
      </ThemeProvider>
    </Router>
    </div>
  );
}

export default App;
