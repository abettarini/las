import React from 'react';

const ImpiantiPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">I Nostri Impianti</h1>
      
      <div className="space-y-10">
        {/* Tunnel */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Tunnel</h2>
              <p className="text-gray-700 mb-4">
                La struttura dispone di un tunnel con due linee con bersaglio motorizzato.
              </p>
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-semibold text-blue-800 mb-2">Caratteristiche:</h3>
                <ul className="list-disc pl-5">
                  <li className="mb-1">Due linee di tiro</li>
                  <li className="mb-1">Bersagli motorizzati</li>
                  <li>Ambiente controllato e sicuro</li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/3 flex items-center justify-center">
              <div className="bg-gray-200 rounded-lg w-full h-48 flex items-center justify-center">
                <span className="text-gray-500 italic">Immagine del tunnel</span>
              </div>
            </div>
          </div>
        </section>

        {/* Linee di tiro arma corta */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-green-800">Linee di tiro arma corta</h2>
              <p className="text-gray-700 mb-4">
                La struttura dispone di 10 linee nelle quali i bersagli possono essere posti a 12, 18 e 25 metri.
              </p>
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">Caratteristiche:</h3>
                <ul className="list-disc pl-5">
                  <li className="mb-1">10 linee di tiro</li>
                  <li className="mb-1">Distanze variabili: 12, 18 e 25 metri</li>
                  <li className="mb-1">Adatto per allenamento e competizioni</li>
                  <li>Illuminazione ottimale</li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/3 flex items-center justify-center">
              <div className="bg-gray-200 rounded-lg w-full h-48 flex items-center justify-center">
                <span className="text-gray-500 italic">Immagine linee arma corta</span>
              </div>
            </div>
          </div>
        </section>

        {/* Linee di tiro per carabina */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-amber-800">Linee di tiro per carabina</h2>
              <p className="text-gray-700 mb-4">
                La struttura dispone di 10 linee di tiro per carabina dalle quali si può sparare a bersagli posti a 100 o 200 metri in appoggio da seduti. I turni sono di 45 minuti, al termine di ogni turno si provvede a cambiare i bersagli.
              </p>
              <div className="bg-amber-50 p-4 rounded-md">
                <h3 className="font-semibold text-amber-800 mb-2">Caratteristiche:</h3>
                <ul className="list-disc pl-5">
                  <li className="mb-1">10 linee di tiro</li>
                  <li className="mb-1">Distanze: 100 e 200 metri</li>
                  <li className="mb-1">Postazioni con appoggio da seduti</li>
                  <li className="mb-1">Turni di 45 minuti</li>
                  <li>Cambio bersagli al termine di ogni turno</li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/3 flex items-center justify-center">
              <div className="bg-gray-200 rounded-lg w-full h-48 flex items-center justify-center">
                <span className="text-gray-500 italic">Immagine linee carabina</span>
              </div>
            </div>
          </div>
        </section>

        {/* Linee di tiro carabina e fucile 50 metri con cinghialino corrente */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 text-purple-800">Linee di tiro carabina e fucile 50 metri con cinghialino corrente</h2>
              <p className="text-gray-700 mb-4">
                La struttura dispone di 10 linee di tiro per sparare a bersagli posizionati a 50 metri e di un cinghialino corrente da ingaggiare sia con carabina sia con fucile usando munizioni a palla unica.
              </p>
              <div className="bg-purple-50 p-4 rounded-md">
                <h3 className="font-semibold text-purple-800 mb-2">Caratteristiche:</h3>
                <ul className="list-disc pl-5">
                  <li className="mb-1">10 linee di tiro a 50 metri</li>
                  <li className="mb-1">Cinghialino corrente</li>
                  <li className="mb-1">Utilizzabile con carabina e fucile</li>
                  <li className="mb-1">Solo munizioni a palla unica</li>
                  <li>Ideale per cacciatori e tiratori sportivi</li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/3 flex items-center justify-center">
              <div className="bg-gray-200 rounded-lg w-full h-48 flex items-center justify-center">
                <span className="text-gray-500 italic">Immagine cinghialino corrente</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Informazioni generali */}
      <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-md">
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
      </div>
    </div>
  );
};

export default ImpiantiPage;