import Link from 'next/link';
import { assetUrl } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="footer-three footer-grey p-top-95">
      <div className="footer-top p-bottom-25">
        <div className="container">
          <div className="row">
            {/* Company Info */}
            <div className="col-lg-2 col-sm-6">
              <div className="widget widget_pages">
                <h2 className="widget-title">Company Info</h2>
                <ul className="list-unstyled">
                  <li className="page-item">
                    <Link href="/about">About Us</Link>
                  </li>
                  <li className="page-item">
                    <Link href="/contact">Contact Us</Link>
                  </li>
                  <li className="page-item">
                    <Link href="/listings">Our Listings</Link>
                  </li>
                  <li className="page-item">
                    <Link href="/pricing">Our Pricings</Link>
                  </li>
                  <li className="page-item">
                    <Link href="#">Support</Link>
                  </li>
                  <li className="page-item">
                    <Link href="#">Privacy Policy</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Helpful Links */}
            <div className="col-lg-3 d-flex justify-content-lg-center col-sm-6">
              <div className="widget widget_pages">
                <h2 className="widget-title">Helpful Links</h2>
                <ul className="list-unstyled">
                  <li className="page-item">
                    <Link href="/register">Join Direo</Link>
                  </li>
                  <li className="page-item">
                    <Link href="/login">Sign In</Link>
                  </li>
                  <li className="page-item">
                    <Link href="#">How it Work</Link>
                  </li>
                  <li className="page-item">
                    <Link href="#">Advantages</Link>
                  </li>
                  <li className="page-item">
                    <Link href="#">Direo App</Link>
                  </li>
                  <li className="page-item">
                    <Link href="/pricing">Packages</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Connect with Us */}
            <div className="col-lg-3 col-sm-6">
              <div className="widget widget_social">
                <h2 className="widget-title">Connect with Us</h2>
                <ul className="list-unstyled social-list">
                  <li>
                    <Link href="#">
                      <span className="mail">
                        <i className="la la-envelope"></i>
                      </span>{' '}
                      Contact Support
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span className="twitter">
                        <i className="fab fa-twitter"></i>
                      </span>{' '}
                      Twitter
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span className="facebook">
                        <i className="fab fa-facebook-f"></i>
                      </span>{' '}
                      Facebook
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span className="instagram">
                        <i className="fab fa-instagram"></i>
                      </span>{' '}
                      Instagram
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span className="gplus">
                        <i className="fab fa-google-plus-g"></i>
                      </span>{' '}
                      Google+
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Direo on Mobile */}
            <div className="col-lg-4 col-sm-6">
              <div className="widget widget_text">
                <h2 className="widget-title">Direo on Mobile</h2>
                <div className="textwidget">
                  <p>
                    Download the Direo app today so you can find your events anytime, anywhere.
                  </p>
                  <ul className="list-unstyled store-btns">
                    <li>
                      <Link
                        href="#"
                        className="btn-gradient btn-gradient-two btn btn-md btn-icon icon-left"
                      >
                        <span className="fab fa-apple"></span> App Store
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="btn btn-dark btn-md btn-icon">
                        <span className="fab fa-android"></span> Google Play
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="footer-bottom--content">
                <Link href="/" className="footer-logo">
                  <img className="light-logo" src={assetUrl('/images/Logo.png')} alt="Direo Logo" />
                  <img className="dark-logo" src={assetUrl('/images/Logo-white.png')} alt="Direo Logo" />
                </Link>
                <p className="m-0 copy-text">
                  ©2019 Direo. Made with{' '}
                  <span className="la la-heart-o"></span> by{' '}
                  <Link href="#">Aazztech</Link>
                </p>
                <ul className="list-unstyled lng-list">
                  <li>
                    <Link href="#">English</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

