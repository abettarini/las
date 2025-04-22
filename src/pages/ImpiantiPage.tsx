import PlantsComponent from '@/components/plants-component';
import { Card, CardContent } from '@/components/ui/card';
import plantsData from '@/data/plants.json';
import React from 'react';

const ImpiantiPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">I Nostri Impianti</h1>
      <div className="space-y-10">
        <PlantsComponent plants={plantsData} />
      </div>

      {/* Informazioni generali */}
      <Card className="mt-10 bg-gray-50">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Informazioni Generali</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Regolamento</h3>
              <p className="text-gray-700 mb-2">
                Tutti gli impianti sono soggetti al regolamento del poligono. È obbligatorio rispettare le norme di sicurezza e seguire le indicazioni del personale.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Prenotazioni</h3>
              <p className="text-gray-700 mb-2">
                Per utilizzare gli impianti è consigliabile prenotare in anticipo, specialmente nei fine settimana e per il cinghialino corrente.
              </p>
              <p className="text-gray-700">
                <a href="/prenotazioni" className="text-blue-600 hover:underline">Vai alla pagina prenotazioni</a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpiantiPage;