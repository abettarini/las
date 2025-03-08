import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";


const ConsiglioDirettivoPage: React.FC = () => {

    return (
        <>
        <h2 className="text-3xl font-bold mb-8 text-center">Consiglio Direttivo</h2>
        <p className="text-center text-muted-foreground pb-4">
        I compiti del Consiglio Direttivo sono quelli di gestire l’associazione, promuovere le attività e amministrare l’associazione.
            </p>
        <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg"></div>
        <hr />
            <div className="flex-1 p-6"><div className="my-8">
            <h3 className="text-2xl font-bold mb-8 text-left">Composizione</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Presidente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">Riccardo Carli</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Vice Presidente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">Gino Bramieri</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Segretario</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">San Francesco</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Consigliere</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">1° Consigliere</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Consigliere</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">2° Consigliere</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Consigliere</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">3° Consigliere</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Consigliere</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">4° Consigliere</p>
                    </CardContent>
                </Card>
            </div>
            
            <h4 className="text-xl font-bold mb-8 text-left">Collegio dei Probiviri</h4>
            <ul className="list-disc pl-8 mb-8">
                <li>1° Proboviro</li>
                <li>2° Proboviro</li>
            </ul>
            <h4 className="text-xl font-bold mb-8 text-left">Collegio dei Revisori dei Conti</h4>
            <ul className="list-disc pl-8 mb-8">
                <li>1° Revisore</li>
                <li>2° Revisore</li>
            </ul>
            <h4 className="text-xl font-bold mb-8 text-left">Rappresentante degli Atleti</h4>
            <ul className="list-disc pl-8 mb-8">
                <li>Riccardo Carli</li>
            </ul>
            <h4 className="text-xl font-bold mb-8 text-left">Rappresentante dei Tecnici</h4>
            <ul className="list-disc pl-8 mb-8">
                <li>Riccardo Carli</li>
            </ul>
            </div>
        </div>
        </>
    );
}

export default ConsiglioDirettivoPage;