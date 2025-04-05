import { logout } from '../../services/auth-service';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const handleConfirm = () => {
    // Esegui il logout
    logout();
    
    // Chiama la callback di conferma
    onConfirm();
    
    // Chiudi la modale
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conferma logout</DialogTitle>
          <DialogDescription>
            Sei sicuro di voler effettuare il logout? Dovrai accedere nuovamente per utilizzare le funzionalità riservate.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Conferma logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}