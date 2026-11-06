'use client';

import * as Accordion from '@radix-ui/react-accordion';

export interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion.Root type="single" collapsible style={{ marginTop: 'var(--space-6)' }}>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={`item-${index}`} className="faq-item">
          <Accordion.Header>
            <Accordion.Trigger className="faq-trigger">
              {item.question}
              <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="faq-content">
            <div className="faq-answer">{item.answer}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
