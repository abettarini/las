import { Button } from "@/components/ui/button";
import {
    Dialog,
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

const STORAGE_KEY_SUBSCRIBED = "newsletter-subscribed";
const STORAGE_KEY_DISMISSED = "newsletter-dismissed";

const isBlocked = () =>
  localStorage.getItem(STORAGE_KEY_SUBSCRIBED) === "true" ||
  sessionStorage.getItem(STORAGE_KEY_DISMISSED) === "true";

const scheduleReshow = (setOpen: (v: boolean) => void) => {
  const delay = Math.random() * 60_000 + 60_000; // 60–120 s random
  setTimeout(() => {
    if (!isBlocked()) setOpen(true);
  }, delay);
};

const NewsletterDialog = ({ delayInSeconds = 10 }: NewsletterDialogProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isBlocked()) return;
    const timer = setTimeout(() => setOpen(true), delayInSeconds * 1000);
    return () => clearTimeout(timer);
  }, [delayInSeconds]);

  // X button, Escape key, backdrop click — reschedule
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) scheduleReshow(setOpen);
    setOpen(nextOpen);
  };

  // "Non ora, grazie" — closes and reschedules (same as X)
  const handleNotNow = () => {
    scheduleReshow(setOpen);
    setOpen(false);
  };

  // "Non mostrare più" — closes and blocks for the whole session
  const handleNeverShow = () => {
    sessionStorage.setItem(STORAGE_KEY_DISMISSED, "true");
    setOpen(false);
  };

  // Successful subscription — closes; localStorage already set by NewsletterSignup
  const handleSuccess = () => {
    setTimeout(() => setOpen(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNeverShow}
              className="text-muted-foreground"
            >
              Non mostrare più
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNotNow}
              className="text-muted-foreground"
            >
              Non ora, grazie
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterDialog;
