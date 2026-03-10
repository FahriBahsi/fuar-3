'use client';

import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import ClientsLogoSection from '@/components/home/ClientsLogoSection';
import SubscribeSection from '@/components/home/SubscribeSection';
import Carousel from '@/components/common/Carousel';
import { assetUrl } from '@/lib/utils';

export default function AboutPage() {
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
      name: 'John Anderson',
      location: 'New York, USA',
      image: '/images/tthumb1.jpg',
      comment:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut autem eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.',
    },
    {
      id: 3,
      name: 'Sarah Williams',
      location: 'London, UK',
      image: '/images/tthumb1.jpg',
      comment:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis.',
    },
  ];
  
  return (
    <>
      {/* About Wrapper with Header and Intro */}
      <section className="about-wrapper bg-gradient-ps">
        <div className="mainmenu-wrapper">
          <Header variant="light" />
        </div>

        {/* About Intro */}
        <div className="about-intro content_above">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-5 col-md-6">
                <h1>Place your Businessor Explore Anything what you want</h1>
                <a href="https://www.youtube.com/watch?v=0C4fX_x_Vsg" className="video-iframe play-btn-two">
                  <span className="icon"><i className="la la-youtube-play"></i></span>
                  <span>Play our Video</span>
                </a>
              </div>
              <div className="col-lg-6 offset-lg-1 col-md-6 offset-md-0 col-sm-8 offset-sm-2">
                <img src={assetUrl('/images/about-illustration.png')} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Contents */}
      <section className="about-contents section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 contents-wrapper">
              {/* Content Block 1 */}
              <div className="contents">
                <div className="row align-items-center">
                  <div className="col-lg-5 col-sm-6">
                    <img src={assetUrl('/images/about-img1.png')} alt="" />
                  </div>
                  <div className="col-lg-6 offset-lg-1 col-sm-6 mt-5 mt-md-0">
                    <h1>About Our Community and Our Expertise</h1>
                    <p>Excepteur sint occaecat cupidatat non proident sunt in culpa officia
                      runmollit anim laborum occaecat cupidatat proident. Cupidatat non
                      proident sunt in culpa officia deserunt.</p>
                  </div>
                </div>
              </div>

              {/* Content Block 2 */}
              <div className="contents">
                <div className="row align-items-center">
                  <div className="col-lg-5 col-sm-6">
                    <h1>Why List on <span>Direo</span></h1>
                    <ul className="list-unstyled list-features p-top-15">
                      <li>
                        <div className="list-count"><span>1</span></div>
                        <div className="list-content">
                          <h4>Easy Registration</h4>
                          <p>Excepteur sint occaecat cupidatat non proident sunt in culpa officia deserunt mollit.</p>
                        </div>
                      </li>
                      <li>
                        <div className="list-count"><span>2</span></div>
                        <div className="list-content">
                          <h4>Promote your Listing</h4>
                          <p>Excepteur sint occaecat cupidatat non proident sunt in culpa officia deserunt mollit.</p>
                        </div>
                      </li>
                      <li>
                        <div className="list-count"><span>3</span></div>
                        <div className="list-content">
                          <h4>Great Sales Benefits</h4>
                          <p>Excepteur sint occaecat cupidatat non proident sunt in culpa officia deserunt mollit.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-6 offset-lg-1 text-right col-sm-6 mt-5 mt-md-0">
                    <img src={assetUrl('/images/about-img2.png')} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Counters Section */}
      <section className="counters-wrapper bg-gradient-pw section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h1>Millions of People</h1>
              <p>turn to Directoria every day to make spending decisions</p>
              <ul className="list-unstyled counter-items">
                <li>
                  <p><span className="count_up">59</span>k+</p>
                  <span>Listings</span>
                </li>
                <li>
                  <p><span className="count_up">23</span>k+</p>
                  <span>Verified Users</span>
                </li>
                <li>
                  <p><span className="count_up">5</span>k+</p>
                  <span>New users per month</span>
                </li>
                <li>
                  <p><span className="count_up">42</span>k+</p>
                  <span>Visitors per month</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonial-wrapper section-padding-strict">
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
              navigation={true}
              pagination={false}
              className="testimonial-carousel"
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="carousel-single">
                  <div className="author-thumb">
                    <img src={assetUrl(testimonial.image)} alt={testimonial.name} className="rounded-circle" />
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

      {/* Clients Logo */}
      <ClientsLogoSection />

      {/* Subscribe Section */}
      <SubscribeSection />
    </>
  );
}
