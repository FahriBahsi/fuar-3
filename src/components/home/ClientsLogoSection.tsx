'use client';

import Carousel from '@/components/common/Carousel';
import { assetUrl } from '@/lib/utils';

export default function ClientsLogoSection() {
  const logos = [
    { id: 1, image: '/images/cl1.png', alt: 'Client Logo 1' },
    { id: 2, image: '/images/cl2.png', alt: 'Client Logo 2' },
    { id: 3, image: '/images/cl3.png', alt: 'Client Logo 3' },
    { id: 4, image: '/images/cl4.png', alt: 'Client Logo 4' },
    { id: 5, image: '/images/cl5.png', alt: 'Client Logo 5' },
    { id: 6, image: '/images/cl1.png', alt: 'Client Logo 6' },
  ];

  return (
    <section className="clients-logo-wrapper border-top p-top-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Carousel
              slidesPerView={5}
              spaceBetween={100}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              navigation={false}
              pagination={false}
              breakpoints={{
                0: { slidesPerView: 2, spaceBetween: 30 },
                575: { slidesPerView: 3, spaceBetween: 50 },
                767: { slidesPerView: 3, spaceBetween: 70 },
                991: { slidesPerView: 5, spaceBetween: 100 },
              }}
              className="logo-carousel"
            >
              {logos.map((logo) => (
                <div key={logo.id} className="carousel-single">
                  <img src={assetUrl(logo.image)} alt={logo.alt} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
