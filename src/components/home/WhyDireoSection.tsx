import Link from 'next/link';
import { assetUrl } from '@/lib/utils';

export default function WhyDireoSection() {
  return (
    <section className="cta section-padding border-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title">
              <h2>
                Why <span>Direo</span> for your Business?
              </h2>
              <p>Explore the popular listings around the world</p>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6">
                <img src={assetUrl('/images/svg/illustration-1.svg')} alt="" className="svg" />
              </div>
              <div className="col-lg-5 offset-lg-1 col-md-6 mt-5 mt-md-0">
                <ul className="feature-list-wrapper list-unstyled">
                  <li>
                    <div className="icon">
                      <span className="circle-secondary">
                        <i className="la la-check-circle"></i>
                      </span>
                    </div>
                    <div className="list-content">
                      <h4>Claim Listing</h4>
                      <p>
                        Excepteur sint occaecat cupidatat non proident sunt in culpa officia
                        deserunt mollit.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <span className="circle-success">
                        <i className="la la-money"></i>
                      </span>
                    </div>
                    <div className="list-content">
                      <h4>Paid Listing</h4>
                      <p>
                        Excepteur sint occaecat cupidatat non proident sunt in culpa officia
                        deserunt mollit.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <span className="circle-primary">
                        <i className="la la-line-chart"></i>
                      </span>
                    </div>
                    <div className="list-content">
                      <h4>Promote your Business</h4>
                      <p>
                        Excepteur sint occaecat cupidatat non proident sunt in culpa officia
                        deserunt mollit.
                      </p>
                    </div>
                  </li>
                </ul>

                <ul className="action-btns list-unstyled">
                  <li>
                    <Link href="/pricing-plans" className="btn btn-success">
                      See our Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/add-listing" className="btn btn-primary">
                      Submit Listings
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

