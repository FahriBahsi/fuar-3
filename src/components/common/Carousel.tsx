'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import { ReactNode } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CarouselProps {
  children: ReactNode[];
  slidesPerView?: number;
  spaceBetween?: number;
  loop?: boolean;
  autoplay?: boolean | { delay: number; disableOnInteraction?: boolean };
  navigation?: boolean;
  pagination?: boolean;
  breakpoints?: {
    [key: number]: {
      slidesPerView: number;
      spaceBetween?: number;
    };
  };
  className?: string;
}

/**
 * Custom Carousel component wrapping Swiper
 * Replaces Owl Carousel with modern React alternative
 */
export default function Carousel({
  children,
  slidesPerView = 1,
  spaceBetween = 30,
  loop = true,
  autoplay = false,
  navigation = true,
  pagination = false,
  breakpoints,
  className = '',
}: CarouselProps) {
  const autoplayConfig =
    typeof autoplay === 'boolean'
      ? autoplay
        ? { delay: 3000, disableOnInteraction: false }
        : false
      : autoplay;

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, A11y]}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      loop={loop}
      autoplay={autoplayConfig}
      navigation={navigation}
      pagination={pagination ? { clickable: true } : false}
      breakpoints={breakpoints}
      className={className}
    >
      {children.map((child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
}

