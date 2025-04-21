import { Button } from '@/components/ui/button'
import { Award, LucideIcon, Shield, Target, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Rifle from './icons/Rifle'

type IconType = 'target' | 'shield' | 'users' | 'award' | 'rifle'

const iconMap: Record<IconType, LucideIcon> = {
  target: Target,
  shield: Shield,
  users: Users,
  award: Award,
  rifle: Rifle,
}

interface ServiceProps {
  title: string
  description: string
  icon: IconType
  ctaText?: string
  link: string
}

export interface Service extends ServiceProps {}

const ServiceCard: React.FC<ServiceProps> = ({ 
  title, 
  description, 
  icon, 
  ctaText = "Scopri di più",
  link = "/"
}) => {
  const IconComponent = iconMap[icon] || Target

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col items-center text-center">
        <div className="rounded-full bg-primary/10 p-3 mb-4">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Link to={link}>
          <Button variant="outline" className="w-full">
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  )
}

// Predefined services data
export const services: Service[] = [
  {
    icon: "target",
    title: "Distanze da 25m a 300m",
    description: "Distanza fino a 300m con telecamere",
    ctaText: "Prenota una sessione",
    link: "/"
  },
  {
    icon: "shield",
    title: "Corsi di Tiro",
    description: "Corsi per principianti ed avanzati con istruttori qualificati.",
    ctaText: "Scopri i corsi",
    link: "/"
  },
  {
    icon: "rifle",
    title: "Armeria",
    description: "Armi a noleggio e munizioni acquistabili presso la struttura.",
    ctaText: "Visualizza",
    link: "/struttura/armeria"
  },
  {
    icon: "award",
    title: "Gare e Eventi",
    description: "Partecipa alle nostre competizioni e eventi speciali.",
    ctaText: "Calendario eventi",
    link: "/"
  }
]

export default ServiceCard