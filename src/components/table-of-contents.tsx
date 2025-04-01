'use client'

import { Button } from "@/components/ui/button";
import { ChevronUp } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface TOCItem {
  title: string;
  level: number;
  id: string;
  items?: TOCItem[];
}

interface TOCProps {
  items: TOCItem[];
  level?: number;
}

const TOCItem: React.FC<TOCProps> = ({ items, level = 0 }) => {
  return (
    <ul className={`space-y-1 ${level > 0 ? 'ml-4' : ''}`}>
      {items.map((item, index) => (
        <li key={index}>
          <Button 
            variant="ghost" 
            className={`text-left justify-start w-full whitespace-normal ${level === 0 ? 'font-semibold' : ''} ${level === 1 ? 'text-sm' : ''} ${level === 2 ? 'text-xs' : ''}`}
            onClick={() => scrollToHeading(item.id)}
          >
            {item.title}
          </Button>
          {item.items && item.items.length > 0 && (
            <TOCItem items={item.items} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
};

const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setItems(generateTOC(content));
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <nav className="bg-gray-100 p-4 rounded-lg sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Indice</h2>
        <TOCItem items={items} />
      </nav>
      {showScrollTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full shadow-lg"
          onClick={scrollToTop}
          aria-label="Torna all'inizio"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};

function generateTOC(content: string): TOCItem[] {
  const headings = content.match(/<h[234][^>]*>(.*?)<\/h[234]>/g) || [];
  const toc: TOCItem[] = [];
  const stack: TOCItem[] = [];

  headings.forEach((heading) => {
    const level = parseInt(heading.charAt(2));
    const title = heading.replace(/<\/?[^>]+(>|$)/g, "");
    const id = slugify(title);
    const item: TOCItem = { title, level, id, items: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      toc.push(item);
    } else {
      stack[stack.length - 1].items!.push(item);
    }

    stack.push(item);
  });

  return toc;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function scrollToHeading(id: string) {
  console.log('Scrolling to:', id); // Debug log
  const element = document.getElementById(id);
  if (element) {
    console.log('Element found:', element); // Debug log
    const yOffset = -80; // Adjust this value based on your fixed header height
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    console.log('Scrolling to Y:', y); // Debug log
    window.scrollTo({top: y, behavior: 'smooth'});
  } else {
    console.log('Element not found'); // Debug log
  }
}

export default TableOfContents;

