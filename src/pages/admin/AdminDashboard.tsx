import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, BarChart3, Calendar, Clock, Loader2, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import { getLoginStats, getStats, LoginData, UserStats } from '../../services/admin-service';

export function AdminDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginStats, setLoginStats] = useState<LoginData[]>([]);
  const [loginPeriod, setLoginPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [loadingLoginStats, setLoadingLoginStats] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadLoginStats();
  }, [loginPeriod]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await getStats();
      if (response.success && response.stats) {
        setStats(response.stats);
      } else {
        toast.error('Errore', {
          description: response.message || 'Impossibile caricare le statistiche'
        });
      }
    } catch (error) {
      console.error('Errore durante il caricamento delle statistiche:', error);
      toast.error('Errore', {
        description: 'Si è verificato un errore durante il caricamento delle statistiche'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLoginStats = async () => {
    setLoadingLoginStats(true);
    try {
      const response = await getLoginStats(loginPeriod);
      if (response.success && response.data) {
        setLoginStats(response.data);
      } else {
        toast.error('Errore', {
          description: response.message || 'Impossibile caricare le statistiche di accesso'
        });
      }
    } catch (error) {
      console.error('Errore durante il caricamento delle statistiche di accesso:', error);
      toast.error('Errore', {
        description: 'Si è verificato un errore durante il caricamento delle statistiche di accesso'
      });
    } finally {
      setLoadingLoginStats(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Benvenuto nel pannello di amministrazione.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utenti Totali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Caricamento...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Utenti registrati nel sistema</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utenti Verificati</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Caricamento...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.verifiedUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Utenti con email verificata</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amministratori</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Caricamento...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.adminUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Utenti con ruolo amministratore</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soci</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Caricamento...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.socioUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Utenti con stato socio attivo</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Informazioni</CardTitle>
            <CardDescription>
              Questo pannello di amministrazione ti permette di gestire gli utenti e altre risorse del sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Utilizza il menu laterale per navigare tra le diverse sezioni del pannello di amministrazione.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistiche di Accesso
            </CardTitle>
            <CardDescription>
              Visualizza gli accessi degli utenti nel tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today" className="w-full" onValueChange={(value) => setLoginPeriod(value as 'today' | 'week' | 'month')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="today" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Oggi
                </TabsTrigger>
                <TabsTrigger value="week" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Ultimi 7 giorni
                </TabsTrigger>
                <TabsTrigger value="month" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Ultimi 30 giorni
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-4 h-[300px]">
                {loadingLoginStats ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : loginStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={loginStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => {
                          if (loginPeriod === 'today') {
                            // Assicurati che il formato sia HH:00
                            return value.includes(':') ? value : `${value}:00`;
                          } else {
                            // Formatta la data come DD/MM
                            const date = new Date(value);
                            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                          }
                        }}
                      />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-md">
                                <p className="font-medium">
                                  {loginPeriod === 'today' 
                                    ? `Ora: ${data.date.includes(':') ? data.date : `${data.date}:00`}`
                                    : `Data: ${new Date(data.date).toLocaleDateString('it-IT')}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Accessi: <span className="font-medium text-foreground">{data.count}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#3b82f6" 
                        name="Accessi" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                    <BarChart3 className="mb-2 h-10 w-10" />
                    <p>Nessun dato disponibile per il periodo selezionato</p>
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}