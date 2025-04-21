import React from 'react';
import faqData from '../../data/faq.json';

const FAQ: React.FC = () => {
  // Create pairs of FAQ items for the grid
  const faqPairs = [];
  for (let i = 0; i < faqData.length; i += 2) {
    const pair = [faqData[i]];
    if (i + 1 < faqData.length) {
      pair.push(faqData[i + 1]);
    } else {
      pair.push(null); // Add null for odd number of items
    }
    faqPairs.push(pair);
  }

  return (
    <section id="faq" className="w-full py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Domande Frequenti</h2>
        
        <div className="space-y-6">
          {faqPairs.map((pair, rowIndex) => (
            <div key={`faq-row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Item */}
              {pair[0] && (
                <div className="flex gap-4 bg-white rounded-lg p-6 shadow-sm h-full">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold">
                      {rowIndex * 2 + 1}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">{pair[0].question}</h3>
                    <p className="text-muted-foreground">{pair[0].answer}</p>
                  </div>
                </div>
              )}

              {/* Right Item */}
              {pair[1] && (
                <div className="flex gap-4 bg-white rounded-lg p-6 shadow-sm h-full">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold">
                      {rowIndex * 2 + 2}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">{pair[1].question}</h3>
                    <p className="text-muted-foreground">{pair[1].answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
