'use client';

import Carousel from '@/components/common/Carousel';
import { assetUrl } from '@/lib/utils';

export default function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Francis Burton',
      location: 'Toronto, Canada',
      image: '/images/tthumb1.jpg',
      comment:
        'Excepteur sint occaecat cupidatat non proident sunt in culpa officia deserunt mollit anim laborum sint occaecat cupidatat non proident. Occaecat cupidatat non proident culpa officia deserunt mollit.',
    },
    {
      id: 2,
      name: 'Jane Smith',
      location: 'New York, USA',
      image: '/images/tthumb1.jpg',
      comment:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut autem eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida risus.',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      location: 'London, UK',
      image: '/images/tthumb1.jpg',
      comment:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis.',
    },
  ];

  return (
    <section className="testimonial-wrapper section-padding--bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title">
              <h2>Trusted By Over 4000+ Users</h2>
              <p>Here is what people say about Direo</p>
            </div>
          </div>

          <Carousel
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={true}
            className="testimonial-carousel"
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="carousel-single">
                <div className="author-thumb">
                  <img
                    src={assetUrl(testimonial.image)}
                    alt={testimonial.name}
                    className="rounded-circle"
                  />
                </div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.location}</span>
                </div>
                <p className="author-comment">{testimonial.comment}</p>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
