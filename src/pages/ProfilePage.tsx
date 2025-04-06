import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Spinner } from '../components/ui/spinner';
import { Switch } from '../components/ui/switch';
import { useAuth } from '../context/auth-context';
import { updateProfile } from '../services/profile-service';

// Schema di validazione per il form del profilo
const profileFormSchema = z.object({
  phone: z.string().min(6, "Inserisci un numero di telefono valido"),
  portoArmi: z.string().optional(),
  scadenzaPortoArmi: z.string().optional(),
  isSocio: z.boolean().optional(),
  numeroTessera: z.string().optional(),
  quotaAnnuale: z.boolean().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, token, setAuthInfo } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ottieni l'anno corrente
  const currentYear = new Date().getFullYear();

  // Inizializzazione di React Hook Form con Zod
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      phone: user?.phone || "",
      portoArmi: user?.portoArmi || "",
      scadenzaPortoArmi: user?.scadenzaPortoArmi || "",
      isSocio: user?.isSocio || false,
      numeroTessera: user?.numeroTessera || "",
      quotaAnnuale: user?.quotaAnnuale || false,
    },
  });

  // Funzione per aggiornare il profilo
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !token) {
      toast.error("Devi essere autenticato per aggiornare il profilo");
      return;
    }

    setIsSubmitting(true);

    try {
      // Utilizza il servizio di aggiornamento del profilo
      const response = await updateProfile({
        phone: data.phone,
        portoArmi: data.portoArmi,
        scadenzaPortoArmi: data.scadenzaPortoArmi,
        isSocio: data.isSocio,
        numeroTessera: data.numeroTessera,
        quotaAnnuale: data.quotaAnnuale
      });

      if (!response.success) {
        throw new Error(response.message || "Errore durante l'aggiornamento del profilo");
      }

      // Se la risposta contiene i dati dell'utente aggiornati, aggiorna il contesto
      if (response.user) {
        setAuthInfo(response.user, token);
      } else {
        // Altrimenti, aggiorna manualmente con i dati del form
        setAuthInfo({
          ...user,
          phone: data.phone,
          portoArmi: data.portoArmi,
          scadenzaPortoArmi: data.scadenzaPortoArmi,
          isSocio: data.isSocio,
          numeroTessera: data.numeroTessera,
          quotaAnnuale: data.quotaAnnuale
        }, token);
      }

      toast.success("Profilo aggiornato con successo");
    } catch (error) {
      console.error("Errore durante l'aggiornamento del profilo:", error);
      toast.error(error instanceof Error ? error.message : "Errore durante l'aggiornamento del profilo");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Il controllo di autenticazione è gestito dal layout

  // Funzione per ottenere le iniziali dell'utente
  const getUserInitials = () => {
    if (!user.email) return '?';
    
    // Se l'email contiene un punto, prendi la prima lettera di ogni parte
    if (user.email.includes('.')) {
      const parts = user.email.split('@')[0].split('.');
      return parts.map(part => part[0].toUpperCase()).join('');
    }
    
    // Altrimenti prendi le prime due lettere dell'email
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 border border-gray-200">
              <AvatarImage src={user.picture} alt={user.name || user.email} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" className="mt-4 text-sm">
              Cambia immagine
            </Button>
          </div>

          <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nome</h3>
            <p className="mt-1 text-lg">{user.name || 'Non specificato'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-lg">{user.email}</p>
            {user.isVerified ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                Verificata
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                Non verificata
              </span>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">ID Utente</h3>
            <p className="mt-1 text-sm text-gray-600">{user.id}</p>
          </div>

          <div className="pt-4 border-t mt-6">
            <h3 className="text-lg font-medium mb-4">Informazioni di contatto</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero di telefono</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="+39 123 456 7890" />
                      </FormControl>
                      <FormDescription>
                        Questo numero verrà utilizzato per le prenotazioni e le comunicazioni importanti.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 border-t mt-6">
                  <h3 className="text-lg font-medium mb-4">Informazioni Porto D'Armi</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="portoArmi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numero Porto D'Armi</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Inserisci il numero del porto d'armi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scadenzaPortoArmi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data di scadenza Porto D'Armi</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t mt-6">
                  <h3 className="text-lg font-medium mb-4">Informazioni Socio</h3>

                  <FormField
                    control={form.control}
                    name="isSocio"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Socio</FormLabel>
                          <FormDescription>
                            Indica se sei un socio del TSN Lastra a Signa
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("isSocio") && (
                    <div className="space-y-4 mt-4 pl-4 border-l-2 border-gray-200">
                      <FormField
                        control={form.control}
                        name="numeroTessera"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numero Tessera</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Inserisci il numero della tessera" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quotaAnnuale"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <FormLabel className="text-base font-normal">
                                  Quota Anno {currentYear}:
                                </FormLabel>
                                {field.value ? (
                                  <Check className="h-5 w-5 text-green-500" />
                                ) : (
                                  <X className="h-5 w-5 text-red-500" />
                                )}
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="mt-6">
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Spinner className="mr-2" size="sm" />
                      Salvataggio...
                    </div>
                  ) : (
                    "Salva modifiche"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  );
}