// Import necessary components and data
import React from 'react';
import { news } from '../data/news';
import NewsCard from './NewsCard';

const NewsList: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid grid-cols-1 gap-4">
        {news.map((newsItem, index) => (
          <NewsCard key={index} {...newsItem} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4">
        
      </div>
    </div>
  );
};

export default NewsList;
