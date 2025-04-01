import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import consiglioData from "../data/consiglio.json";

const ConsiglioDirettivoPage: React.FC = () => {
    const { consiglio } = consiglioData;

    return (
        <>
            <h2 className="text-3xl font-bold mb-8 text-center">Consiglio Direttivo</h2>
            <p className="text-center text-muted-foreground pb-4">
                I compiti del Consiglio Direttivo sono quelli di gestire l'associazione, promuovere le attività e amministrare l'associazione.
            </p>
            <hr className="mb-8" />
            
            <div className="flex-1 p-6">
                <div className="my-8">
                    <h3 className="text-2xl font-bold mb-8 text-left">Organigramma</h3>
                    
                    {/* Presidente */}
                    <div className="flex justify-center mb-8">
                        <Card className="w-64 bg-blue-50 border-blue-200">
                            <CardHeader className="bg-blue-100 pb-2">
                                <CardTitle className="text-center text-blue-800">Presidente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center font-semibold">{consiglio.presidente}</p>
                            </CardContent>
                        </Card>
                    </div>
                    
                    {/* Linea di connessione */}
                    <div className="flex justify-center">
                        <div className="w-0.5 h-8 bg-gray-300"></div>
                    </div>
                    
                    {/* Vice Presidente e Segretario */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
                        <Card className="bg-blue-50 border-blue-200">
                            <CardHeader className="bg-blue-100 pb-2">
                                <CardTitle className="text-center text-blue-800">Vice Presidente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center font-semibold">{consiglio.vice_presidente}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-blue-50 border-blue-200">
                            <CardHeader className="bg-blue-100 pb-2">
                                <CardTitle className="text-center text-blue-800">Segretario</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center font-semibold">{consiglio.segretario}</p>
                            </CardContent>
                        </Card>
                    </div>
                    
                    {/* Linea di connessione */}
                    <div className="flex justify-center">
                        <div className="w-0.5 h-8 bg-gray-300"></div>
                    </div>
                    
                    {/* Consiglieri */}
                    <div className="mb-12">
                        <h4 className="text-xl font-semibold mb-4 text-center text-blue-800">Consiglieri</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {consiglio.consiglieri.map((consigliere, index) => (
                                <Card key={index} className="bg-gray-50 border-gray-200">
                                    <CardContent className="pt-4">
                                        <p className="text-center">{consigliere}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    
                    {/* Collegio dei Probiviri */}
                    <div className="mb-12">
                        <h4 className="text-xl font-semibold mb-4 text-center text-green-800 border-t pt-8">Collegio dei Probiviri</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                            {consiglio.collegio_probiviri.map((proboviro, index) => (
                                <Card key={index} className="bg-green-50 border-green-200">
                                    <CardContent className="pt-4">
                                        <p className="text-center">{proboviro}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    
                    {/* Collegio dei Revisori dei Conti */}
                    <div className="mb-12">
                        <h4 className="text-xl font-semibold mb-4 text-center text-amber-800 border-t pt-8">Collegio dei Revisori dei Conti</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                            {consiglio.collegio_revisori.map((revisore, index) => (
                                <Card key={index} className="bg-amber-50 border-amber-200">
                                    <CardContent className="pt-4">
                                        <p className="text-center">{revisore}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    
                    {/* Rappresentanti */}
                    <div className="mb-8">
                        <h4 className="text-xl font-semibold mb-4 text-center text-purple-800 border-t pt-8">Rappresentanti</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                            {Object.entries(consiglio.rappresentanti).map(([categoria, nome], index) => (
                                <Card key={index} className="bg-purple-50 border-purple-200">
                                    <CardHeader className="bg-purple-100 pb-2">
                                        <CardTitle className="text-center text-purple-800">Rappresentante {categoria}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-center">{nome}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ConsiglioDirettivoPage;