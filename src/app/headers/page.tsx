import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Header Styles - Direo',
  description: 'Showcase of different header styles and variations',
};

export default function HeadersPage() {
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
          title="Header Styles"
        />
      </section>

      {/* Header Light Style */}
      <section className="header-style p-top-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Header Light</h2>
                <p>The Light Version of Header Navbar</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-dark">
          <Header variant="light" />
        </div>
      </section>

      {/* Header Dark Style */}
      <section className="header-style p-top-100 p-bottom-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Header Dark</h2>
                <p>The Dark Version of Header Navbar</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <Header variant="dark" />
        </div>
      </section>
    </>
  );
}

