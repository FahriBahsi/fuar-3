'use client';

import { useEffect } from 'react';

export default function BackToTop() {
  useEffect(() => {
    const body = document.body;
    const toggleScrolledClass = () => {
      if (window.pageYOffset > 300) {
        body.classList.add('scrolled');
      } else {
        body.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', toggleScrolledClass);
    return () => window.removeEventListener('scroll', toggleScrolledClass);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      className="go_top no-print"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // lineHeight: '1',
        width: '45px',
        height: '45px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '50%',
        color: '#ffffff !important',
        cursor: 'pointer',
       
      }}

    >
      <i className="la la-angle-up"></i>
    </button>
  );
}
