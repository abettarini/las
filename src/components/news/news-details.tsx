import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Content } from './news-list'

type NewsDetailsProps = {
  content: Content
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
}

export default function NewsDetails({ content, onPrevious, onNext, hasPrevious, hasNext }: NewsDetailsProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{content.date}</p>
        <p className="mb-4">{content.abstract}</p>
        <div className="prose max-w-none">
          <p>{content.fullContent}</p>
        </div>
      </div>
      <div className="mt-8 flex justify-between items-center">
        <Button
          onClick={onPrevious}
          disabled={!hasPrevious}
          variant="outline"
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Precedente
        </Button>
        <Button
          onClick={onNext}
          disabled={!hasNext}
          variant="outline"
          className="flex items-center"
        >
          Successivo <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

