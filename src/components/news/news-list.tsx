import { Book, FileText, Video } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import NewsCard from './news-card'
import NewsDetails from './news-details'

export type Content = {
  id: number
  type: 'article' | 'video' | 'book'
  date: string
  title: string
  abstract: string
  fullContent: string
}

const getIcon = (type: Content['type']) => {
  switch (type) {
    case 'article':
      return <FileText className="w-5 h-5" />
    case 'video':
      return <Video className="w-5 h-5" />
    case 'book':
      return <Book className="w-5 h-5" />
  }
}

type NewsListProps = {
    contents: Content[]
    itemsPerPage?: number
}

export default function NewsList({ contents, itemsPerPage }: NewsListProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const selectContent = (index: number) => {
    setSelectedIndex(index)
  }

  const navigatePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const navigateNext = () => {
    if (selectedIndex < contents.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  const totalPages = Math.ceil(contents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentContents = contents.slice(startIndex, endIndex)

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-4 md:mb-0">
        <div className="space-y-2">
          {currentContents.map((content, index) => (
            <NewsCard
              key={content.id}
              icon={getIcon(content.type)}
              date={content.date}
              title={content.title}
              abstract={content.abstract}
              onClick={() => selectContent(startIndex + index)}
              isSelected={startIndex + index === selectedIndex}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Precedente
          </Button>
          <span>{currentPage} di {totalPages}</span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Successiva
          </Button>
        </div>
      </div>
      <div className="md:w-2/2 md:pl-4 md:border-l">
        <NewsDetails
          content={contents[selectedIndex]}
          onPrevious={navigatePrevious}
          onNext={navigateNext}
          hasPrevious={selectedIndex > 0}
          hasNext={selectedIndex < contents.length - 1}
        />
      </div>
    </div>
  )
}

