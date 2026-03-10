import Link from 'next/link';
import { assetUrl } from '@/lib/utils';

export default function AuthorNotFound() {
  return (
    <>
      <section className="header-breadcrumb bgimage overlay overlay--dark">
        <div className="bg_image_holder">
          <img src={assetUrl("/images/breadcrumb1.jpg")} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-area text-center">
                <h2 className="breadcrumb__title">Author Not Found</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center py-5">
                <i className="la la-user-times empty-state-icon-large"></i>
                <h2 className="mt-4">Author Not Found</h2>
                <p className="text-muted mb-4">
                  The author you're looking for doesn't exist or has been removed.
                </p>
                <Link href="/" className="btn btn-primary">
                  <i className="la la-home"></i> Go Back Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
