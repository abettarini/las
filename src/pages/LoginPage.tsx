import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { requestLogin } from '../services/auth-service';

// Schema di validazione per il form di login
const loginSchema = z.object({
  email: z.string().email('Inserisci un indirizzo email valido'),
});

// Tipo per i dati del form
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Inizializza il form con react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  });

  // Gestisce l'invio del form
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      // Invia la richiesta di login
      const response = await requestLogin(data.email);

      if (response.success) {
        // Login richiesto con successo
        toast.success('Email di accesso inviata', {
          description: 'Controlla la tua email per accedere al tuo account',
        });
        
        // Mostra il messaggio di conferma
        setEmailSent(true);
      } else if (response.requiresVerification) {
        // L'utente non ha verificato l'email
        toast.info('Email non verificata', {
          description: 'Ti abbiamo inviato una nuova email di verifica',
        });
      } else {
        // Errore durante la richiesta di login
        toast.error('Errore durante l\'accesso', {
          description: response.message,
        });
      }
    } catch (error) {
      console.error('Errore durante la richiesta di login:', error);
      toast.error('Errore durante l\'accesso', {
        description: 'Si è verificato un errore durante la richiesta di accesso',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Accedi</h1>
      
      {emailSent ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Email di accesso inviata</h2>
          <p className="text-green-700 mb-4">
            Abbiamo inviato un'email con un link per accedere al tuo account.
            Controlla la tua casella di posta e clicca sul link per accedere.
          </p>
          <p className="text-sm text-green-600">
            Se non ricevi l'email entro pochi minuti, controlla la cartella spam
            o prova a richiedere un nuovo link di accesso.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Indirizzo Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Pulsante di Invio */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Invio in corso...' : 'Invia link di accesso'}
            </button>
          </div>

          {/* Link alla pagina di registrazione */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Non hai un account?{' '}
              <a href="/registrazione" className="font-medium text-blue-600 hover:text-blue-500">
                Registrati
              </a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}