'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import FAQField from './FAQField';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQManagerProps {
  onFAQsChange?: (faqs: FAQItem[]) => void;
}

export default function FAQManager({ onFAQsChange }: FAQManagerProps) {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      id: 'faq-1',
      question: '',
      answer: '',
    },
  ]);

  const handleAddFAQ = () => {
    const newFAQ: FAQItem = {
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
    };
    const updatedFAQs = [...faqItems, newFAQ];
    setFaqItems(updatedFAQs);
    onFAQsChange?.(updatedFAQs);
  };

  const handleRemoveFAQ = (id: string) => {
    const updatedFAQs = faqItems.filter((faq) => faq.id !== id);
    setFaqItems(updatedFAQs);
    onFAQsChange?.(updatedFAQs);
  };

  const handleQuestionChange = (id: string, question: string) => {
    const updatedFAQs = faqItems.map((faq) =>
      faq.id === id ? { ...faq, question } : faq
    );
    setFaqItems(updatedFAQs);
    onFAQsChange?.(updatedFAQs);
  };

  const handleAnswerChange = (id: string, answer: string) => {
    const updatedFAQs = faqItems.map((faq) =>
      faq.id === id ? { ...faq, answer } : faq
    );
    setFaqItems(updatedFAQs);
    onFAQsChange?.(updatedFAQs);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const items = Array.from(faqItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFaqItems(items);
    onFAQsChange?.(items);
  };

  return (
    <div className="faq-manager">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="faq-items">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              id="faqs_info_sortable_container"
              className={`sortable-container ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
            >
              {faqItems.map((faq, index) => (
                <FAQField
                  key={faq.id}
                  id={faq.id}
                  index={index}
                  question={faq.question}
                  answer={faq.answer}
                  onQuestionChange={handleQuestionChange}
                  onAnswerChange={handleAnswerChange}
                  onRemove={handleRemoveFAQ}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        type="button"
        className="btn btn-secondary btn-sm m-top-20"
        onClick={handleAddFAQ}
        id="addNewFAQS"
      >
        <span className="plus-sign">+</span>
        Add New
      </button>
    </div>
  );
}
