import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Pricing Plans - Direo',
  description: 'Choose the perfect plan for your listings',
};

export default function PricingPlansPage() {
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
          title="Pricing Plans"
        />
      </section>

      {/* Pricing Plans Content */}
      <section className="section-padding-1_7 section-bg">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="pricing pricing--1">
                <div className="pricing__title">
                  <h4>
                    Basic Plan
                    <span className="atbd_plan-active">Active</span>
                  </h4>
                </div>
                <div className="pricing__price rounded">
                  <p className="pricing_value">
                    <sup>$</sup>49<small> / 30 days</small>
                  </p>
                  <p className="pricing_subtitle">Per Package</p>
                </div>
                <div className="pricing__features">
                  <ul className="list-unstyled">
                    <li><span className="la la-check available"></span><span className="atbd_color-success">Unlimited</span> Regular Listings</li>
                    <li><span className="la la-check available"></span><span className="atbd_color-success">Unlimited</span> Premium Listings</li>
                    <li><span className="la la-check available"></span>100 Price Limit Options</li>
                    <li><span className="la la-check available"></span>150 Tags Limit</li>
                    <li><span className="la la-check available"></span><span className="atbd_color-success">Unlimited</span> Listing Image</li>
                    <li><span className="la la-times unavailable"> </span>Average Price Range</li>
                    <li><span className="la la-times unavailable"> </span>Business Hours</li>
                    <li><span className="la la-times unavailable"> </span>Image Gallery</li>
                    <li><span className="la la-times unavailable"></span> Gallery Image Limit</li>
                  </ul>
                  <div className="price_action m-top-25">
                    <a href="" className="btn btn-block btn-outline-secondary price_action--btn">Continue</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="pricing pricing--1 atbd_pricing_special">
                <span className="atbd_popular_badge">Recommended</span>
                <div className="pricing__title">
                  <h4>
                    Advanced Plan
                  </h4>
                </div>
                <div className="pricing__price rounded">
                  <p className="pricing_value">
                    <sup>$</sup>99<small> / 30 days</small>
                  </p>
                  <p className="pricing_subtitle">Per Package</p>
                </div>
                <div className="pricing__features">
                  <ul className="list-unstyled">
                    <li><span className="la la-check available"></span><span className="atbd_color-success">Unlimited</span> Regular Listings</li>
                    <li><span className="la la-check available"></span><span className="atbd_color-success">Unlimited</span> Premium Listings</li>
                    <li><span className="la la-check available"></span>100 Price Limit Options</li>
                    <li><span className="la la-check available"></span>150 Tags Limit</li>
                    <li><span className="la la-check available"></span><span className="atbd_color-success">Unlimited</span> Listing Image</li>
                    <li><span className="la la-times unavailable"> </span>Average Price Range</li>
                    <li><span className="la la-times unavailable"> </span>Business Hours</li>
                    <li><span className="la la-times unavailable"> </span>Image Gallery</li>
                    <li><span className="la la-times unavailable"></span> Gallery Image Limit</li>
                  </ul>
                  <div className="price_action m-top-25">
                    <a href="" className="btn btn-block btn-secondary price_action--btn">Continue</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="pricing pricing--1">
                <div className="pricing__title">
                  <h4>
                    Enterprise Plan
                  </h4>
                </div>
                <div className="pricing__price rounded">
                  <p className="pricing_value">
                    <sup>$</sup>199<small> / 30 days</small>
                  </p>
                  <p className="pricing_subtitle">Per Package</p>
                </div>
                <div className="pricing__features">
                  <ul className="list-unstyled">
                    <li><span className="la la-check available"></span><span className="atbd_color-success">Unlimited</span> Regular Listings</li>
                    <li><span className="la la-check available"></span><span className="atbd_color-success">Unlimited</span> Premium Listings</li>
                    <li><span className="la la-check available"></span>100 Price Limit Options</li>
                    <li><span className="la la-check available"></span>150 Tags Limit</li>
                    <li><span className="la la-check available"></span><span className="atbd_color-success">Unlimited</span> Listing Image</li>
                    <li><span className="la la-times unavailable"> </span>Average Price Range</li>
                    <li><span className="la la-times unavailable"> </span>Business Hours</li>
                    <li><span className="la la-times unavailable"> </span>Image Gallery</li>
                    <li><span className="la la-times unavailable"></span> Gallery Image Limit</li>
                  </ul>
                  <div className="price_action m-top-25">
                    <a href="" className="btn btn-block btn-outline-secondary price_action--btn">Continue</a>
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
