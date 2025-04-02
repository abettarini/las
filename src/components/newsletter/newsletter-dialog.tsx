import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog";
import { Bell, Target } from "lucide-react";
import { useEffect, useState } from "react";
import NewsletterSignup from "./newsletter-signup";

interface NewsletterDialogProps {
  delayInSeconds?: number;
}

const NewsletterDialog = ({ delayInSeconds = 10 }: NewsletterDialogProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already subscribed or dismissed
    const hasSubscribed = localStorage.getItem("newsletter-subscribed") === "true";
    const hasDismissed = sessionStorage.getItem("newsletter-dismissed") === "true";

    if (!hasSubscribed && !hasDismissed) {
      // Set timer to show dialog after specified delay
      const timer = setTimeout(() => {
        setOpen(true);
      }, delayInSeconds * 1000);

      return () => clearTimeout(timer);
    }
  }, [delayInSeconds]);

  const handleSuccess = () => {
    // Close dialog after successful subscription
    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  const handleDismiss = () => {
    // Mark as dismissed for this session
    sessionStorage.setItem("newsletter-dismissed", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/90 to-primary text-white p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl text-white mb-2">
            Resta sempre nel centro!
          </DialogTitle>
          <DialogDescription className="text-center text-white/90">
            Iscriviti alla newsletter per non perdere eventi, gare e novità
          </DialogDescription>
        </div>

        <div className="p-6">
          <div className="flex items-start space-x-3 mb-4">
            <Bell className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Ricevi notifiche su:</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Prossime gare ed eventi</li>
                <li>• Corsi e attività formative</li>
                <li>• Novità e aggiornamenti della struttura</li>
              </ul>
            </div>
          </div>

          <NewsletterSignup onSuccess={handleSuccess} />

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-6">
            <DialogClose asChild>
              <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-muted-foreground">
                Non ora, grazie
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterDialog;