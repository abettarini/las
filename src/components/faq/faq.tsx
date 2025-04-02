import React from 'react';
import faqData from '../../data/faq.json';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../components/ui/accordion";

const FAQ: React.FC = () => {
  return (
    <section id="faq">
        <Accordion
      type="single"
      collapsible
      className="w-full space-y-2"
    >
      {faqData.map(({ question, answer }, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="data-[state=open]:border-b-2 data-[state=open]:border-indigo-600 dark:data-[state=open]:border-indigo-500"
        >
          <AccordionTrigger className="text-left">{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
    </section>
  );
};

export default FAQ;
