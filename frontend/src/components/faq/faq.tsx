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
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <h2 className="faq-heading">Domande Frequenti</h2>
        
        <div className="space-y-6">
          {faqPairs.map((pair, rowIndex) => (
            <div key={`faq-row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Item */}
              {pair[0] && (
                <div className="faq-item">
                  <div className="flex-shrink-0">
                    <div className="faq-number">
                      {rowIndex * 2 + 1}
                    </div>
                  </div>
                  <div className="faq-content">
                    <h3 className="faq-question">{pair[0].question}</h3>
                    <p className="faq-answer">{pair[0].answer}</p>
                  </div>
                </div>
              )}

              {/* Right Item */}
              {pair[1] && (
                <div className="faq-item">
                  <div className="flex-shrink-0">
                    <div className="faq-number">
                      {rowIndex * 2 + 2}
                    </div>
                  </div>
                  <div className="faq-content">
                    <h3 className="faq-question">{pair[1].question}</h3>
                    <p className="faq-answer">{pair[1].answer}</p>
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
