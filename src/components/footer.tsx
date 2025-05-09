import { SiFacebook, SiInstagram } from '@icons-pack/react-simple-icons';
import { CreditCard, Mail, Phone, Printer } from 'lucide-react';
import ConsentBanner from './consent-banner/consent-banner';
import FooterNewsletter from './newsletter/footer-newsletter';
import NewsletterDialog from './newsletter/newsletter-dialog';
import { OrariApertura } from './OrariApertura';

const Footer = () => {
    return (
        <>
          <NewsletterDialog delayInSeconds={15} />
          <footer className="mx-4 mb-4 rounded-lg border-t bg-footer" role="contentinfo">
            <div className="container py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold mb-4">Indirizzo</h3>
                  <p className="text-muted-foreground">
                    Via del Tiro a Segno, 1<br />
                    50055 Lastra a Signa (FI)
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Contatti</h3>
                  <p className="text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      info@poligonolastra.it
                    </span>
                    <span className="flex items-center gap-2 mt-2">
                      <Phone className="h-4 w-4" />
                      +39 055 8722638
                    </span>
                    <span className="flex items-center gap-2 mt-2">
                      <Printer className="h-4 w-4" />
                      +39 055 8722638
                    </span>
                  </p>
                </div>
                <OrariApertura />
                <div>
                  <div className="mb-8">
                    <FooterNewsletter />
                  </div>

                  <div>
                    <h3 className="font-bold mb-4">Social</h3>
                    <div className="flex gap-4">
                      <a href="#" className="text-muted-foreground hover:text-primary">
                        <SiFacebook className="h-6 w-6" />
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-primary">
                        <SiInstagram className="h-6 w-6" />
                      </a>
                    </div>
                    <div className="mt-4">
                      <ConsentBanner showAs='link' />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sezione pagamenti */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">Accettiamo pagamenti con carte di credito</span>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-8" />
                    <img src="/images/payment/visa.svg" alt="Visa" className="h-8" />
                    <img src="/images/payment/maestro.svg" alt="Maestro" className="h-8" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    I pagamenti sono sicuri e gestiti tramite gateway certificati PCI DSS.
                  </p>
                </div>
              </div>
              
              {/* Copyright */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} TSN Lastra a Signa. Tutti i diritti riservati.</p>
                <p className="mt-2">
                  Realizzato da <a href="https://monema.it" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Monema</a>
                </p>
              </div>
            </div>
          </footer>
        </>
    )
}

export default Footer;