import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export interface DimaCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

const DimaCTA: React.FC<DimaCTAProps> = ({
  title = "Corso DIMA",
  description = "Partecipa al nostro corso per il rilascio del Diploma di Idonenità al Maneggio Armi.",
  buttonText = "Prenota Ora",
  className,
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 mix-blend-multiply"
          style={{ 
            backgroundImage: "url('/assets/poligono.jpg')", 
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3
          }}
        />
        <CardHeader className="relative z-10">
          <CardTitle className="text-3xl font-bold text-primary">{title}</CardTitle>
          <CardDescription className="text-lg font-medium">{description}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Lezioni teoriche e pratiche</li>
            <li>Istruttori qualificati</li>
            <li>Materiale didattico incluso</li>
          </ul>
        </CardContent>
        <CardFooter className="relative z-10">
          <Button size="lg" asChild>
            <Link to="/prenotazioni">
              {buttonText}
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default DimaCTA;