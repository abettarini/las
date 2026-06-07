import DimaCTA from "@/components/dima-cta";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import priceData from "@/data/price.json";
import { Helmet } from "react-helmet-async";

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
                  {priceData.subscription.map((item, index) => (
                    <div 
                      key={index} 
                      className={`grid grid-cols-2 items-center ${
                        index < priceData.subscription.length - 1 ? "border-b pb-2" : ""
                      }`}
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-right">{item.price}</span>
                    </div>
                  ))}
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
                      {priceData.shooting_line.map((line, index) => (
                        <tr 
                          key={index} 
                          className={`${
                            index < priceData.shooting_line.length - 1 ? "border-b" : ""
                          } hover:bg-muted/50`}
                        >
                          <td className="py-3 px-4 font-medium">{line.name}</td>
                          <td className="py-3 px-4 text-center">{line.socio}</td>
                          <td className="py-3 px-4 text-center">{line.ospite}</td>
                          <td className="py-3 px-4 text-center">{line.militari}</td>
                        </tr>
                      ))}
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
                  {priceData.courses.map((course, index) => (
                    <div 
                      key={index} 
                      className={`grid grid-cols-2 items-center ${
                        index < priceData.courses.length - 1 ? "border-b pb-2" : ""
                      }`}
                    >
                      <span className="font-medium">{course.name}</span>
                      <span className="text-right">{course.price}</span>
                    </div>
                  ))}
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