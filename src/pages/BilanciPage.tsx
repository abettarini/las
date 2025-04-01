import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { FileIcon, FileTextIcon } from 'lucide-react';
import React, { useState } from 'react';
import bilanciData from '../data/bilanci.json';

const BilanciPage: React.FC = () => {
  // Ottieni l'anno corrente per impostare il tab predefinito
  const currentYear = new Date().getFullYear().toString();
  
  // Trova l'anno più recente disponibile nei dati
  const availableYears = bilanciData.anni.map(anno => anno.anno);
  const mostRecentYear = availableYears.length > 0 ? availableYears[0] : currentYear;
  
  // Stato per il tab attivo
  const [activeTab, setActiveTab] = useState(mostRecentYear);
  
  // Formatta la data in formato italiano
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd MMMM yyyy', { locale: it });
    } catch (error) {
      return dateStr;
    }
  };

  // Renderizza il contenuto per un anno specifico
  const renderYearContent = (anno: any) => {
    return (
      <div className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Bilancio Preventivo */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center">
              <FileIcon className="mr-2" size={20} />
              Bilancio Preventivo
            </h3>
            <Button 
              variant="outline" 
              className="w-full text-green-700 border-green-200 hover:bg-green-100"
              asChild
            >
              <a href={anno.bilancio_preventivo.link} target="_blank" rel="noopener noreferrer">
                {anno.bilancio_preventivo.titolo}
              </a>
            </Button>
          </div>
          
          {/* Bilancio Consuntivo */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h3 className="text-lg font-semibold mb-3 text-amber-800 flex items-center">
              <FileIcon className="mr-2" size={20} />
              Bilancio Consuntivo
            </h3>
            <Button 
              variant="outline" 
              className="w-full text-amber-700 border-amber-200 hover:bg-amber-100"
              asChild
            >
              <a href={anno.bilancio_consuntivo.link} target="_blank" rel="noopener noreferrer">
                {anno.bilancio_consuntivo.titolo}
              </a>
            </Button>
          </div>
        </div>
        
        {/* Verbali */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800 flex items-center">
            <FileTextIcon className="mr-2" size={20} />
            Verbali di Assemblea
          </h3>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Data</TableHead>
                  <TableHead className="w-1/3">Titolo</TableHead>
                  <TableHead className="w-1/3 text-right">Documento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anno.verbali
                  .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                  .map((verbale, vIndex) => (
                    <TableRow key={vIndex}>
                      <TableCell className="font-medium">{formatDate(verbale.data)}</TableCell>
                      <TableCell>{verbale.titolo}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                          asChild
                        >
                          <a href={verbale.link} target="_blank" rel="noopener noreferrer">
                            Visualizza
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Bilanci e Verbali</h1>
      
      <p className="text-center text-muted-foreground mb-8">
        In questa sezione sono disponibili i bilanci preventivi, consuntivi e i verbali delle assemblee degli ultimi anni.
      </p>
      
      <Card className="mb-10">
        <Tabs defaultValue={mostRecentYear} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-6">
            {bilanciData.anni.map((anno) => (
              <TabsTrigger key={anno.anno} value={anno.anno} className="text-center">
                {anno.anno}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {bilanciData.anni.map((anno) => (
            <TabsContent key={anno.anno} value={anno.anno} className="mt-0">
              {renderYearContent(anno)}
            </TabsContent>
          ))}
        </Tabs>
      </Card>
      
      <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Informazioni</h2>
        <p className="mb-2">
          I bilanci e i verbali sono disponibili in formato PDF. Per visualizzarli è necessario avere installato un lettore PDF.
        </p>
        <p>
          Per richiedere copie di bilanci o verbali di anni precedenti, si prega di contattare la segreteria.
        </p>
      </div>
    </div>
  );
};

export default BilanciPage;