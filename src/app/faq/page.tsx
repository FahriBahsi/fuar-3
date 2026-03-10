'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const faqs = [
    {
      question: 'How to open an account?',
      answer: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa kequi officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusan tium doloremque laudantium, totam rem aperiam the eaque ipsa quae abillo was inventore veritatis keret quasi aperiam architecto beatae vitae dicta sunt explicabo. Nemo ucxqui officia voluptatem accusantium.'
    },
    {
      question: 'How to add listing?',
      answer: 'Ensuring productivity and growth is essential for architecture and engineering teams. The industry requires a high.'
    },
    {
      question: 'What is featured listing?',
      answer: 'Ensuring productivity and growth is essential for architecture and engineering teams. The industry requires a high.'
    },
    {
      question: 'How to add listing?',
      answer: 'Ensuring productivity and growth is essential for architecture and engineering teams. The industry requires a high.'
    },
    {
      question: 'What is featured listing?',
      answer: 'Ensuring productivity and growth is essential for architecture and engineering teams. The industry requires a high.'
    }
  ];

  const handleAccordionClick = (index: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <>
      {/* Header with Breadcrumb */}
      <section className="header-breadcrumb bgimage overlay overlay--dark">
        <div className="bg_image_holder">
          <img src="/images/breadcrumb1.jpg" alt="" />
        </div>

        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'All Listings' },
          ]}
          title="FAQs"
        />
      </section>

      {/* FAQ Section */}
      <section className="faq-wrapper section-padding border-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Your Questions Answered</h2>
                <p>Eiusmod temporeum dicant partem scripserit</p>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="faq-contents">
                <div className="atbd_content_module atbd_faqs_module">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4><span className="la la-question-circle"></span>Lisiitng FAQ's</h4>
                    </div>
                  </div>
                  <div className="atbdb_content_module_contents">
                    <div className="atbdp-accordion">
                      {faqs.map((faq, index) => (
                        <div key={index} className={`accordion-single ${activeIndex === index ? 'selected' : ''}`}>
                          <h3 className="faq-title">
                            <a href="#" onClick={(e) => handleAccordionClick(index, e)}>
                              {faq.question}
                            </a>
                          </h3>
                          <p className="ac-body" style={{ display: activeIndex === index ? 'block' : 'none' }}>
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
