'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl = '/listings' }: PaginationProps) {
  const searchParams = useSearchParams();

  // Build URL with current search params
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="navigation pagination d-flex justify-content-end" role="navigation">
      <div className="nav-links">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link href={buildUrl(currentPage - 1)} className="prev page-numbers">
            <span className="la la-long-arrow-left"></span>
          </Link>
        ) : (
          <span className="prev page-numbers disabled">
            <span className="la la-long-arrow-left"></span>
          </span>
        )}

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const isActive = pageNum === currentPage;
          
          if (isActive) {
            return (
              <span key={pageNum} aria-current="page" className="page-numbers current">
                {pageNum}
              </span>
            );
          }
          
          return (
            <Link key={pageNum} href={buildUrl(pageNum)} className="page-numbers">
              {pageNum}
            </Link>
          );
        })}

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link href={buildUrl(currentPage + 1)} className="next page-numbers">
            <span className="la la-long-arrow-right"></span>
          </Link>
        ) : (
          <span className="next page-numbers disabled">
            <span className="la la-long-arrow-right"></span>
          </span>
        )}
      </div>
    </nav>
  );
}

