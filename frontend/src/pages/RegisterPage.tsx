import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Turnstile from 'react-turnstile';
import { toast } from 'sonner';
import { z } from 'zod';
import { registerUser, RegistrationData } from '../services/auth-service';

// Schema di validazione per il form di registrazione
const registrationSchema = z.object({
  email: z.string().email('Inserisci un indirizzo email valido'),
  emailConfirmation: z.string().email('Inserisci un indirizzo email valido'),
  birthDate: z.string().refine(date => {
    // Verifica che la data sia nel formato YYYY-MM-DD
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }, { message: 'Inserisci una data valida nel formato YYYY-MM-DD' }),
  securityQuestion1: z.string().min(1, 'Seleziona una domanda di sicurezza'),
  securityAnswer1: z.string().min(1, 'Inserisci una risposta'),
  securityQuestion2: z.string().min(1, 'Seleziona una domanda di sicurezza'),
  securityAnswer2: z.string().min(1, 'Inserisci una risposta'),
}).refine(data => data.email === data.emailConfirmation, {
  message: 'Le email non corrispondono',
  path: ['emailConfirmation'],
}).refine(data => data.securityQuestion1 !== data.securityQuestion2, {
  message: 'Seleziona due domande diverse',
  path: ['securityQuestion2'],
});

// Tipo per i dati del form
type RegistrationFormData = z.infer<typeof registrationSchema>;

// Domande di sicurezza
const securityQuestions = [
  'Qual è il nome di tuo padre?',
  'Qual è il nome del tuo primo animale domestico?',
  'Qual è il cognome da nubile di tua madre?',
  'Qual è il nome della città in cui sei nato/a?',
  'Qual è il nome della tua scuola elementare?',
  'Qual è il nome del tuo migliore amico d\'infanzia?',
  'Qual è il tuo film preferito?',
  'Qual è il tuo colore preferito?',
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);

  // Inizializza il form con react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      emailConfirmation: '',
      birthDate: '',
      securityQuestion1: '',
      securityAnswer1: '',
      securityQuestion2: '',
      securityAnswer2: '',
    },
  });

  // Ottieni i valori correnti del form
  const watchedValues = watch();

  // Gestisce l'invio del form
  const onSubmit = async (data: RegistrationFormData) => {
    // Verifica che il token Turnstile sia presente
    if (!turnstileToken) {
      setTurnstileError('Completa la verifica di sicurezza');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepara i dati per la registrazione
      const registrationData: RegistrationData = {
        ...data,
        cfTurnstileResponse: turnstileToken,
      };

      // Invia la richiesta di registrazione
      const response = await registerUser(registrationData);

      if (response.success) {
        // Registrazione completata con successo
        toast.success('Registrazione completata con successo', {
          description: 'Controlla la tua email per verificare il tuo account',
        });
        
        // Reindirizza alla pagina di login
        navigate('/login');
      } else {
        // Errore durante la registrazione
        toast.error('Errore durante la registrazione', {
          description: response.message,
        });
      }
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      toast.error('Errore durante la registrazione', {
        description: 'Si è verificato un errore durante la registrazione',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Registrazione</h1>
      
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

        {/* Conferma Email */}
        <div>
          <label htmlFor="emailConfirmation" className="block text-sm font-medium text-gray-700 mb-1">
            Conferma Indirizzo Email
          </label>
          <input
            id="emailConfirmation"
            type="email"
            {...register('emailConfirmation')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.emailConfirmation && (
            <p className="mt-1 text-sm text-red-600">{errors.emailConfirmation.message}</p>
          )}
        </div>

        {/* Data di Nascita */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
            Data di Nascita
          </label>
          <input
            id="birthDate"
            type="date"
            {...register('birthDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
          )}
        </div>

        {/* Domanda di Sicurezza 1 */}
        <div>
          <label htmlFor="securityQuestion1" className="block text-sm font-medium text-gray-700 mb-1">
            Domanda di Sicurezza 1
          </label>
          <select
            id="securityQuestion1"
            {...register('securityQuestion1')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleziona una domanda</option>
            {securityQuestions.map((question, index) => (
              <option key={index} value={question}>
                {question}
              </option>
            ))}
          </select>
          {errors.securityQuestion1 && (
            <p className="mt-1 text-sm text-red-600">{errors.securityQuestion1.message}</p>
          )}
        </div>

        {/* Risposta 1 */}
        <div>
          <label htmlFor="securityAnswer1" className="block text-sm font-medium text-gray-700 mb-1">
            Risposta 1
          </label>
          <input
            id="securityAnswer1"
            type="text"
            {...register('securityAnswer1')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.securityAnswer1 && (
            <p className="mt-1 text-sm text-red-600">{errors.securityAnswer1.message}</p>
          )}
        </div>

        {/* Domanda di Sicurezza 2 */}
        <div>
          <label htmlFor="securityQuestion2" className="block text-sm font-medium text-gray-700 mb-1">
            Domanda di Sicurezza 2
          </label>
          <select
            id="securityQuestion2"
            {...register('securityQuestion2')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleziona una domanda</option>
            {securityQuestions
              .filter(question => question !== watchedValues.securityQuestion1)
              .map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
          </select>
          {errors.securityQuestion2 && (
            <p className="mt-1 text-sm text-red-600">{errors.securityQuestion2.message}</p>
          )}
        </div>

        {/* Risposta 2 */}
        <div>
          <label htmlFor="securityAnswer2" className="block text-sm font-medium text-gray-700 mb-1">
            Risposta 2
          </label>
          <input
            id="securityAnswer2"
            type="text"
            {...register('securityAnswer2')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.securityAnswer2 && (
            <p className="mt-1 text-sm text-red-600">{errors.securityAnswer2.message}</p>
          )}
        </div>

        {/* Turnstile */}
        <div className="flex justify-center">
          <Turnstile
            sitekey="0x4AAAAAABDYSKm0qzHLkKyu" // Sostituisci con la tua chiave Turnstile
            onSuccess={token => {
              setTurnstileToken(token);
              setTurnstileError(null);
            }}
            onError={() => {
              setTurnstileToken(null);
              setTurnstileError('Errore durante la verifica di sicurezza');
            }}
            onExpire={() => {
              setTurnstileToken(null);
              setTurnstileError('La verifica di sicurezza è scaduta');
            }}
          />
        </div>
        {turnstileError && (
          <p className="mt-1 text-sm text-red-600 text-center">{turnstileError}</p>
        )}

        {/* Pulsante di Invio */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registrazione in corso...' : 'Registrati'}
          </button>
        </div>

        {/* Link alla pagina di login */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Hai già un account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Accedi
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}