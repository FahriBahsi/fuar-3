'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { assetUrl } from '@/lib/utils';

export default function CTASection() {
  const bgHolderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apply background image after mount
    if (bgHolderRef.current) {
      const img = bgHolderRef.current.querySelector('img');
      if (img) {
        const imgSrc = img.getAttribute('src');
        if (imgSrc) {
          bgHolderRef.current.style.backgroundImage = `url(${imgSrc})`;
          bgHolderRef.current.style.opacity = '1';
          bgHolderRef.current.setAttribute('data-bg-processed', 'true');
        }
      }
    }
  }, []);

  return (
    <section className="cta-wrapper bgimage overlay overlay--dark">
      <div 
        className="bg_image_holder" 
        ref={bgHolderRef}
        style={{ opacity: 0 }}
        data-bg-processed="false"
      >
        <img src={assetUrl('/images/cta.png')} alt="" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="cta-content text-center">
              <h2 className="text-white">List Your Business Today</h2>
              <p className="text-white">
                Join thousands of businesses already using Direo to reach more customers
              </p>
              <div className="cta-action mt-4">
                <Link href="/add-listing" className="btn btn-lg btn-gradient btn-gradient-two">
                  Get Started Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

