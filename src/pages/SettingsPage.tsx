import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, Mail, Shield } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Schema di validazione per il form delle impostazioni
const settingsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  securityAlerts: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Inizializzazione di React Hook Form con Zod
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      emailNotifications: true,
      marketingEmails: false,
      securityAlerts: true,
    },
  });

  // Funzione per salvare le impostazioni
  const onSubmit = async (data: SettingsFormValues) => {
    setIsSaving(true);
    
    // Simulazione di una richiesta API
    setTimeout(() => {
      console.log('Impostazioni salvate:', data);
      toast.success('Impostazioni salvate con successo');
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Notifiche</CardTitle>
              <CardDescription>
                Configura come e quando ricevere notifiche.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        <FormLabel className="text-base">Notifiche via email</FormLabel>
                      </div>
                      <FormDescription>
                        Ricevi email per le tue prenotazioni e altre attività.
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
              
              <FormField
                control={form.control}
                name="marketingEmails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                        <FormLabel className="text-base">Email di marketing</FormLabel>
                      </div>
                      <FormDescription>
                        Ricevi email su eventi, novità e promozioni.
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
              
              <FormField
                control={form.control}
                name="securityAlerts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                        <FormLabel className="text-base">Avvisi di sicurezza</FormLabel>
                      </div>
                      <FormDescription>
                        Ricevi notifiche per accessi sospetti o modifiche importanti.
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
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Salvataggio...' : 'Salva impostazioni'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}