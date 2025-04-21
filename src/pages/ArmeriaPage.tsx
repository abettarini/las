import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Check, X } from "lucide-react";
import { Helmet } from "react-helmet";

// Define weapon type
type Weapon = {
  id: string;
  brand: string;
  model: string;
  caliber: string;
  hasOptics: boolean;
  opticsDetails?: string;
  image: string;
  description?: string;
};

// Define ammunition type
type Ammunition = {
  id: string;
  caliber: string;
  type: string;
  price: string;
  available: boolean;
};

// Weapons data by category
const rifles: Weapon[] = [
  {
    id: "rifle-1",
    brand: "Remington",
    model: "700",
    caliber: ".308 Winchester",
    hasOptics: true,
    opticsDetails: "Leupold VX-3i 4.5-14x40mm",
    image: "https://www.remarms.com/uploads/product/Model_700_BDL_308_Win_Rifle_27007_Detail_1.jpg",
    description: "Carabina bolt-action di precisione, ideale per tiro a lunga distanza."
  },
  {
    id: "rifle-2",
    brand: "Tikka",
    model: "T3x Tactical",
    caliber: ".223 Remington",
    hasOptics: true,
    opticsDetails: "Vortex Viper PST Gen II 5-25x50",
    image: "https://www.tikka.fi/sites/default/files/2023-03/T3x_TAC_A1_308Win_24_BLK_1.png",
    description: "Carabina tattica con canna flottante e calciatura sintetica regolabile."
  },
  {
    id: "rifle-3",
    brand: "Sako",
    model: "TRG-22",
    caliber: ".308 Winchester",
    hasOptics: true,
    opticsDetails: "Schmidt & Bender PM II 5-25x56",
    image: "https://www.sako.global/sites/default/files/styles/product_image_1200/public/2023-03/TRG_22_308Win_20_BLK_1.png",
    description: "Carabina di precisione professionale utilizzata da tiratori sportivi e forze speciali."
  }
];

const shotguns: Weapon[] = [
  {
    id: "shotgun-1",
    brand: "Benelli",
    model: "M4",
    caliber: "12",
    hasOptics: false,
    image: "https://www.benelliusa.com/sites/default/files/styles/firearm_1004/public/content/firearms/shotguns/m4/m4-tactical-shotgun-11707/m4-tactical-shotgun-11707-profile.png",
    description: "Fucile a pompa semiautomatico, utilizzato anche dalle forze speciali."
  },
  {
    id: "shotgun-2",
    brand: "Beretta",
    model: "1301 Tactical",
    caliber: "12",
    hasOptics: true,
    opticsDetails: "Red dot Aimpoint Micro T-2",
    image: "https://www.beretta.com/assets/12/7/1301_tactical_1.png",
    description: "Fucile semiautomatico tattico, leggero e maneggevole."
  }
];

const semiAutoPistols: Weapon[] = [
  {
    id: "pistol-1",
    brand: "Glock",
    model: "17 Gen5",
    caliber: "9x21 IMI",
    hasOptics: false,
    image: "https://us.glock.com/-/media/Global/US/old/US-Products/G17-Gen5-FS-MOS/G17G5FSMOS_01.ashx",
    description: "Pistola semiautomatica affidabile e robusta, utilizzata da forze dell'ordine in tutto il mondo."
  },
  {
    id: "pistol-2",
    brand: "Beretta",
    model: "92FS",
    caliber: "9x21 IMI",
    hasOptics: false,
    image: "https://www.beretta.com/assets/0/15/DimGalleryLarge/92fs_zoom001.jpg",
    description: "Pistola semiautomatica italiana, arma d'ordinanza di numerose forze armate e di polizia."
  },
  {
    id: "pistol-3",
    brand: "CZ",
    model: "Shadow 2",
    caliber: "9x21 IMI",
    hasOptics: false,
    image: "https://cz-usa.com/wp-content/uploads/2017/04/CZ-Shadow-2-Black-Blue-9mm-4.89-inch-17Rds-91257.png",
    description: "Pistola da competizione, molto apprezzata nelle gare IPSC."
  },
  {
    id: "pistol-4",
    brand: "Walther",
    model: "PPQ Q5 Match",
    caliber: "9x21 IMI",
    hasOptics: true,
    opticsDetails: "Red dot Trijicon RMR",
    image: "https://waltherarms.com/wp-content/uploads/2019/01/Walther-Q5-Match-SF-Pro-9mm-Pistol-2830001-1.png",
    description: "Pistola da competizione con slitta per ottiche, trigger migliorato e canna match."
  }
];

const revolvers: Weapon[] = [
  {
    id: "revolver-1",
    brand: "Smith & Wesson",
    model: "686 Plus",
    caliber: ".357 Magnum",
    hasOptics: false,
    image: "https://www.smith-wesson.com/sites/default/files/styles/firearms_1004/public/firearms/images/164194_01_lg.jpg",
    description: "Revolver a 7 colpi in acciaio inox, versatile e preciso."
  },
  {
    id: "revolver-2",
    brand: "Ruger",
    model: "GP100",
    caliber: ".357 Magnum",
    hasOptics: false,
    image: "https://ruger.com/productImages/1707/detail/1.jpg",
    description: "Revolver robusto e affidabile, ideale per tiro sportivo."
  }
];

// Ammunition data
const ammunitions: Ammunition[] = [
  { id: "ammo-1", caliber: "9x21 IMI", type: "FMJ 124gr", price: "€0.50/colpo", available: true },
  { id: "ammo-2", caliber: ".45 ACP", type: "FMJ 230gr", price: "€0.65/colpo", available: true },
  { id: "ammo-3", caliber: ".38 Special", type: "LSWC 148gr", price: "€0.55/colpo", available: true },
  { id: "ammo-4", caliber: ".357 Magnum", type: "JHP 158gr", price: "€0.80/colpo", available: true },
  { id: "ammo-5", caliber: ".223 Remington", type: "FMJ 55gr", price: "€0.90/colpo", available: true },
  { id: "ammo-6", caliber: ".308 Winchester", type: "HPBT 168gr", price: "€1.20/colpo", available: true },
  { id: "ammo-7", caliber: "12 (Slug)", type: "Brenneke 28gr", price: "€1.50/colpo", available: true },
  { id: "ammo-8", caliber: "12 (Pallini)", type: "n.7 28gr", price: "€0.80/colpo", available: true },
  { id: "ammo-9", caliber: ".22 LR", type: "Standard Velocity 40gr", price: "€0.15/colpo", available: true }
];

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