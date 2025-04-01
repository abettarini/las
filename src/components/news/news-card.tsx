import { Card, CardContent } from '@/components/ui/card'
import { ReactNode } from 'react'

type NewsCardProps = {
  icon: ReactNode
  date: string
  title: string
  abstract: string
  onClick: () => void
  isSelected: boolean
}

export default function NewsCard({ icon, date, title, abstract, onClick, isSelected }: NewsCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-accent' : 'hover:bg-accent/50'}`}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center">
        <div className="bg-primary/10 p-2 rounded-full mr-4">{icon}</div>
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{date}</p>
          <p className="text-sm mt-1 text-muted-foreground line-clamp-2">{abstract}</p>
        </div>
      </CardContent>
    </Card>
  )
}

