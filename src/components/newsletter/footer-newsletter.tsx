import { Mail } from "lucide-react";
import NewsletterSignup from "./newsletter-signup";

const FooterNewsletter = () => {
  return (
    <div>
      <h3 className="font-bold mb-4">Newsletter</h3>
      <div className="mb-3 text-muted-foreground text-sm">
        <p className="flex items-start gap-2">
          <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Iscriviti per ricevere aggiornamenti su eventi, gare e novità</span>
        </p>
      </div>
      <NewsletterSignup variant="compact" />
    </div>
  );
};

export default FooterNewsletter;