'use client';

import { Draggable } from 'react-beautiful-dnd';

interface FAQFieldProps {
  id: string;
  index: number;
  question: string;
  answer: string;
  onQuestionChange: (id: string, question: string) => void;
  onAnswerChange: (id: string, answer: string) => void;
  onRemove: (id: string) => void;
}

export default function FAQField({
  id,
  index,
  question,
  answer,
  onQuestionChange,
  onAnswerChange,
  onRemove,
}: FAQFieldProps) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`directorist row atbdp_faqs_wrapper ${
            snapshot.isDragging ? 'is-dragging' : ''
          }`}
          id={`faqsID-${index}`}
        >
          <div className="col-md-3 col-sm-12">
            <div className="form-group">
              <input
                type="text"
                placeholder="Question"
                name={`faqs[${index}][quez]`}
                id={`atbdp_faq_question_${id}`}
                className="form-control atbdp_faqs_quez"
                value={question}
                onChange={(e) => onQuestionChange(id, e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="form-group">
              <textarea
                rows={3}
                placeholder="Answer"
                name={`faqs[${index}][ans]`}
                className="form-control directory_field atbdp_faqs_input"
                value={answer}
                onChange={(e) => onAnswerChange(id, e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-md-3 col-sm-12 d-flex align-items-center justify-content-center">
            <span
              className="removeFAQSField btn-danger"
              id={`removeFAQ-${id}`}
              title="Remove this item"
              onClick={() => onRemove(id)}
              style={{ cursor: 'pointer', marginRight: '8px' }}
            >
              <i className="la la-times"></i>
            </span>
            <div
              className="adl-move-icon btn-secondary"
              title="Drag to reorder"
            >
              <i className="la la-arrows"></i>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
