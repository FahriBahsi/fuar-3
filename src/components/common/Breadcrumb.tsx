'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { BreadcrumbItem } from '@/types/common';
import { assetUrl } from '@/lib/utils';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  title?: string;
}

export default function Breadcrumb({ items, title }: BreadcrumbProps) {
  const bgHolderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Process background image
    const bgHolder = bgHolderRef.current;
    if (!bgHolder) return;

    const img = bgHolder.querySelector('img');
    if (img && img.src) {
      bgHolder.style.backgroundImage = `url('${img.src}')`;
      bgHolder.style.backgroundSize = 'cover';
      bgHolder.style.backgroundPosition = 'center';
      bgHolder.style.backgroundRepeat = 'no-repeat';
      bgHolder.setAttribute('data-bg-processed', 'true');
      
      // Fade in effect
      requestAnimationFrame(() => {
        bgHolder.style.opacity = '1';
      });
    }
  }, [items, title]); // Re-run when route changes

  return (
    <section className="header-breadcrumb bgimage overlay overlay--dark">
      <div 
        className="bg_image_holder" 
        ref={bgHolderRef}
        style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
        data-bg-processed="false"
      >
        <img src={assetUrl('/images/breadcrumb1.jpg')} alt="" />
      </div>
      <div className="mainmenu-wrapper">
        <Header variant="light" sticky={false} />
      </div>

      <div className="breadcrumb-wrapper content_above">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              {title && <h1 className="page-title">{title}</h1>}
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    
                    return (
                      <li
                        key={index}
                        className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                        {...(isLast && { 'aria-current': 'page' })}
                      >
                        {isLast || !item.href ? (
                          item.label
                        ) : (
                          <Link href={item.href}>{item.label}</Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

