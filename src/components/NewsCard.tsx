import { Award, Calendar, Info, LucideIcon, Megaphone, MessageCircle, Newspaper, Shield, Target, Users } from 'lucide-react';
import { Label } from 'react-aria-components';
import { Button } from './ui/button';

type IconType = 'news' | 'event' | 'info' | 'megaphone' | 'target' | 'shield' | 'users' | 'award' | 'communication';

const iconMap: Record<IconType, LucideIcon> = {
  target: Target,
  info: Info,
  megaphone: Megaphone,
  shield: Shield,
  users: Users,
  award: Award,
  news: Newspaper,
  event: Calendar,
  communication: MessageCircle
}
export interface NewsItem {
  title: string
  type: IconType
  date: string
  excerpt: string
  image?: string
}

const NewsCard: React.FC<NewsItem> = ({ title, date, excerpt, image, type }) => {
  const IconComponent = iconMap[type] || Target

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('it-IT')
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      {image && (
        <div className="aspect-video relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Label>{type.toUpperCase()}</Label>
          <IconComponent className="h-6 w-6 mr-2" />
          <time dateTime={date} className="text-xl">{formatDate(date)} asdsa</time>
        </div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{excerpt}</p>
        <Button variant="outline" className="w-full">
          Leggi di più
        </Button>
      </div>
    </div>
  )
}

export default NewsCard