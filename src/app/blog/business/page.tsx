import { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import BlogCard from '@/components/blog/BlogCard';
import { getBlogPosts } from '@/lib/api-blog';

export const metadata: Metadata = {
  title: 'Blog Business - Direo',
  description: 'Read our latest blog posts about business and entrepreneurship',
};

export default async function BlogBusinessPage() {
  const allPosts = await getBlogPosts();
  const posts = allPosts.filter(post => post.category.slug === 'business');
  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: 'Business' },
        ]}
        title="Blog - Business"
      />

      {/* Blog Area */}
      <section className="blog-area section-padding-strict border-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="blog-posts">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} variant="list" />
                ))}
              </div>

              {/* Pagination */}
              <div className="m-top-50">
                <nav className="navigation pagination d-flex justify-content-end">
                  <div className="nav-links">
                    <a className="prev page-numbers" href=""><span className="la la-long-arrow-left"></span></a>
                    <span aria-current="page" className="page-numbers current">1</span>
                    <a className="page-numbers" href="">2</a>
                    <a className="next page-numbers" href=""><span className="la la-long-arrow-right"></span></a>
                  </div>
                </nav>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-md-4 mt-5 mt-md-0">
              <div className="sidebar">
                {/* Search Widget */}
                <div className="widget-wrapper">
                  <div className="search-widget">
                    <form action="#">
                      <div className="input-group">
                        <input type="text" className="fc--rounded" placeholder="Search" />
                        <button type="submit"><i className="la la-search"></i></button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Categories Widget */}
                <div className="widget-wrapper">
                  <div className="widget-default">
                    <div className="widget-header">
                      <h6 className="widget-title">Categories</h6>
                    </div>
                    <div className="widget-content">
                      <div className="category-widget">
                        <ul>
                          <li className="arrow-list4"><a href="">Business</a></li>
                          <li className="arrow-list4"><a href="">Entrepreneurship</a></li>
                          <li className="arrow-list4"><a href="">Marketing</a></li>
                          <li className="arrow-list4"><a href="">Finance</a></li>
                        </ul>
                      </div>
                    </div>
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
