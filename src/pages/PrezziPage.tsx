import DimaCTA from "@/components/dima-cta";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet";

const PrezziPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Prezzi - TSN Lastra a Signa</title>
        <meta name="description" content="Listino prezzi del Tiro a Segno Nazionale di Lastra a Signa" />
      </Helmet>

      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Listino Prezzi</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Tariffe e costi per i servizi offerti dal TSN Lastra a Signa
          </p>
        </div>

        <Tabs defaultValue="iscrizioni" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="iscrizioni">Iscrizioni</TabsTrigger>
            <TabsTrigger value="linee">Linee di Tiro</TabsTrigger>
            <TabsTrigger value="corsi">Corsi</TabsTrigger>
          </TabsList>

          <TabsContent value="iscrizioni" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quote Associative</CardTitle>
                <CardDescription>Tariffe annuali per l'iscrizione al TSN</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 items-center border-b pb-2">
                    <span className="font-medium">Iscrizione Volontaria</span>
                    <span className="text-right">€ 120,00</span>
                  </div>
                  <div className="grid grid-cols-2 items-center border-b pb-2">
                    <span className="font-medium">Iscrizione Obbligatoria (GPG, GPG Ausiliari)</span>
                    <span className="text-right">€ 100,00</span>
                  </div>
                  <div className="grid grid-cols-2 items-center border-b pb-2">
                    <span className="font-medium">Rinnovo Volontario</span>
                    <span className="text-right">€ 100,00</span>
                  </div>
                  <div className="grid grid-cols-2 items-center border-b pb-2">
                    <span className="font-medium">Rinnovo Obbligatorio</span>
                    <span className="text-right">€ 80,00</span>
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    <span className="font-medium">Riduzione Under 16</span>
                    <span className="text-right">- 50%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Le quote associative hanno validità per l'anno solare in corso.
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="linee" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tariffe Linee di Tiro</CardTitle>
                <CardDescription>Costi per l'utilizzo delle linee di tiro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Servizio</th>
                        <th className="text-center py-3 px-4">Socio</th>
                        <th className="text-center py-3 px-4">Ospite</th>
                        <th className="text-center py-3 px-4">Militari*</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Linea a 25m (1 ora)</td>
                        <td className="py-3 px-4 text-center">€ 10,00</td>
                        <td className="py-3 px-4 text-center">€ 15,00</td>
                        <td className="py-3 px-4 text-center">€ 8,00</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Linea a 50m (1 ora)</td>
                        <td className="py-3 px-4 text-center">€ 12,00</td>
                        <td className="py-3 px-4 text-center">€ 18,00</td>
                        <td className="py-3 px-4 text-center">€ 10,00</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Linea aria compressa (1 ora)</td>
                        <td className="py-3 px-4 text-center">€ 8,00</td>
                        <td className="py-3 px-4 text-center">€ 12,00</td>
                        <td className="py-3 px-4 text-center">€ 6,00</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Noleggio arma (escluse munizioni)</td>
                        <td className="py-3 px-4 text-center">€ 5,00</td>
                        <td className="py-3 px-4 text-center">€ 8,00</td>
                        <td className="py-3 px-4 text-center">€ 5,00</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Bersagli (cadauno)</td>
                        <td className="py-3 px-4 text-center">€ 0,50</td>
                        <td className="py-3 px-4 text-center">€ 0,50</td>
                        <td className="py-3 px-4 text-center">€ 0,50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">* Militari: tariffe applicabili solo se ci sono linee disponibili</p>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>Gli ospiti devono essere accompagnati da un socio</li>
                  <li>I militari devono presentare il tesserino di servizio</li>
                  <li>Per i gruppi sono disponibili tariffe speciali</li>
                </ul>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="corsi" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Corsi e Certificazioni</CardTitle>
                <CardDescription>Tariffe per corsi e certificazioni</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 items-center border-b pb-2">
                    <span className="font-medium">Corso DIMA (Diploma Idoneità Maneggio Armi)</span>
                    <span className="text-right">€ 150,00</span>
                  </div>
                  <div className="grid grid-cols-2 items-center border-b pb-2">
                    <span className="font-medium">Certificazione per porto d'armi</span>
                    <span className="text-right">€ 80,00</span>
                  </div>
                  <div className="grid grid-cols-2 items-center border-b pb-2">
                    <span className="font-medium">Corso base di tiro (3 lezioni)</span>
                    <span className="text-right">€ 120,00</span>
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    <span className="font-medium">Lezione privata con istruttore (1 ora)</span>
                    <span className="text-right">€ 40,00</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                I corsi includono materiale didattico e utilizzo delle linee di tiro durante le lezioni.
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12">
          <DimaCTA 
            title="Corso DIMA" 
            description="Ottieni il Diploma di Idoneità al Maneggio Armi con il nostro corso completo."
            buttonText="Scopri di Più"
            className="w-full"
          />
        </div>

        <div className="mt-8 bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Informazioni Aggiuntive</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Tutti i prezzi sono IVA inclusa</li>
            <li>Le tariffe possono subire variazioni. Verificare sempre in segreteria</li>
            <li>Sono disponibili pacchetti e abbonamenti per utilizzo frequente delle linee di tiro</li>
            <li>Per i gruppi e le aziende sono disponibili tariffe speciali</li>
            <li>I soci possono usufruire di sconti su acquisti presso armerie convenzionate</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrezziPage;