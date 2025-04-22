import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import armoryData from "@/data/armory.json";
import { Ammunition, Weapon } from "@/types/armory";
import { Check, X } from "lucide-react";
import { Helmet } from "react-helmet-async";

// Get weapons data from JSON file
const rifles: Weapon[] = armoryData.weapons.rifles;
const shotguns: Weapon[] = armoryData.weapons.shotguns;
const semiAutoPistols: Weapon[] = armoryData.weapons.semiAutoPistols;
const revolvers: Weapon[] = armoryData.weapons.revolvers;

// Get ammunition data from JSON file
const ammunitions: Ammunition[] = armoryData.ammunitions;

// Weapon card component
const WeaponCard = ({ weapon }: { weapon: Weapon }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{weapon.brand} {weapon.model}</CardTitle>
        <CardDescription>Calibro: {weapon.caliber}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="aspect-video relative mb-4 bg-muted rounded-md overflow-hidden">
          <Image 
            src={weapon.image} 
            alt={`${weapon.brand} ${weapon.model}`} 
            fill 
            className="object-cover"
            fallback={<div className="w-full h-full flex items-center justify-center bg-muted">Immagine non disponibile</div>}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Ottica:</span>
            {weapon.hasOptics ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Check className="h-3.5 w-3.5 mr-1" />
                Sì
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <X className="h-3.5 w-3.5 mr-1" />
                No
              </Badge>
            )}
          </div>
          {weapon.hasOptics && weapon.opticsDetails && (
            <div>
              <span className="font-medium">Dettagli ottica:</span>
              <p className="text-sm text-muted-foreground">{weapon.opticsDetails}</p>
            </div>
          )}
          {weapon.description && (
            <p className="text-sm text-muted-foreground mt-2">{weapon.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ArmeriaPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Armeria - TSN Lastra a Signa</title>
        <meta name="description" content="Armeria del Tiro a Segno Nazionale di Lastra a Signa: armi disponibili per il noleggio e munizioni in vendita" />
      </Helmet>

      <div className="space-y-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Armeria</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Armi disponibili per il noleggio e munizioni in vendita
          </p>
        </div>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Informazioni sul Noleggio</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Il noleggio delle armi è riservato ai soci in regola con l'iscrizione annuale</li>
            <li>È necessario essere in possesso di porto d'armi in corso di validità o aver conseguito il DIMA</li>
            <li>Il costo del noleggio è di €5,00 per sessione (munizioni escluse)</li>
            <li>Le armi vengono consegnate e restituite sotto la supervisione del direttore di tiro</li>
            <li>È obbligatorio seguire tutte le norme di sicurezza durante l'utilizzo delle armi</li>
          </ul>
        </div>

        {/* Carabine Section */}
        <section id="carabine">
          <div className="flex items-center mb-6">
            <div className="flex-grow-0">
              <h2 className="text-3xl font-bold">Carabine</h2>
              <p className="text-muted-foreground">Carabine disponibili per il noleggio</p>
            </div>
            <div className="h-px flex-grow bg-border ml-6"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rifles.map(rifle => (
              <WeaponCard key={rifle.id} weapon={rifle} />
            ))}
          </div>
        </section>

        {/* Fucili Section */}
        <section id="fucili">
          <div className="flex items-center mb-6">
            <div className="flex-grow-0">
              <h2 className="text-3xl font-bold">Fucili</h2>
              <p className="text-muted-foreground">Fucili disponibili per il noleggio</p>
            </div>
            <div className="h-px flex-grow bg-border ml-6"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shotguns.map(shotgun => (
              <WeaponCard key={shotgun.id} weapon={shotgun} />
            ))}
          </div>
        </section>

        {/* Pistole Semi-Auto Section */}
        <section id="pistole">
          <div className="flex items-center mb-6">
            <div className="flex-grow-0">
              <h2 className="text-3xl font-bold">Pistole Semi-Automatiche</h2>
              <p className="text-muted-foreground">Pistole semi-automatiche disponibili per il noleggio</p>
            </div>
            <div className="h-px flex-grow bg-border ml-6"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {semiAutoPistols.map(pistol => (
              <WeaponCard key={pistol.id} weapon={pistol} />
            ))}
          </div>
        </section>

        {/* Revolver Section */}
        <section id="revolver">
          <div className="flex items-center mb-6">
            <div className="flex-grow-0">
              <h2 className="text-3xl font-bold">Revolver</h2>
              <p className="text-muted-foreground">Revolver disponibili per il noleggio</p>
            </div>
            <div className="h-px flex-grow bg-border ml-6"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {revolvers.map(revolver => (
              <WeaponCard key={revolver.id} weapon={revolver} />
            ))}
          </div>
        </section>

        {/* Munizioni Section */}
        <section id="munizioni">
          <div className="flex items-center mb-6">
            <div className="flex-grow-0">
              <h2 className="text-3xl font-bold">Munizioni</h2>
              <p className="text-muted-foreground">Calibri disponibili presso la nostra armeria</p>
            </div>
            <div className="h-px flex-grow bg-border ml-6"></div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Calibro</th>
                      <th className="text-left py-3 px-4">Tipo</th>
                      <th className="text-left py-3 px-4">Prezzo</th>
                      <th className="text-left py-3 px-4">Disponibilità</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ammunitions.map(ammo => (
                      <tr key={ammo.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{ammo.caliber}</td>
                        <td className="py-3 px-4">{ammo.type}</td>
                        <td className="py-3 px-4">{ammo.price}</td>
                        <td className="py-3 px-4">
                          {ammo.available ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Disponibile
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Esaurito
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">I prezzi possono variare in base alla disponibilità. Verificare sempre in armeria.</p>
            </CardContent>
          </Card>
        </section>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Note Importanti</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Le immagini sono puramente indicative</li>
            <li>La disponibilità delle armi può variare, si consiglia di verificare in anticipo</li>
            <li>È possibile richiedere armi specifiche con preavviso</li>
            <li>Per i soci che partecipano a competizioni sono disponibili condizioni speciali</li>
            <li>L'acquisto di munizioni è consentito solo ai possessori di porto d'armi in corso di validità</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ArmeriaPage;