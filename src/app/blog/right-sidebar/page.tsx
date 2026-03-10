import { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import BlogCard from '@/components/blog/BlogCard';
import { getBlogPosts } from '@/lib/api-blog';
import Link from 'next/link';
import { assetUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog Right Sidebar - Direo',
  description: 'Read our latest blog posts with right sidebar layout',
};

export default async function BlogRightSidebarPage() {
  const posts = await getBlogPosts();
  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'All Listings' },
        ]}
        title="Blog Right Sidebar"
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
                <nav className="navigation pagination d-flex justify-content-center" role="navigation">
                  <div className="nav-links">
                    <a className="prev page-numbers" href=""><span className="la la-long-arrow-left"></span></a>
                    <a className="page-numbers" href="">1</a>
                    <span aria-current="page" className="page-numbers current">2</span>
                    <a className="page-numbers" href="">3</a>
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
                          <li className="arrow-list4"><a href="">Finance</a></li>
                          <li className="arrow-list4"><a href="">Industry Reports</a></li>
                          <li className="arrow-list4"><a href="">Strategy</a></li>
                          <li className="arrow-list4"><a href="">Technology</a></li>
                          <li className="arrow-list4"><a href="">Marketing</a></li>
                          <li className="arrow-list4"><a href="">Strategy</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular Post Widget */}
                <div className="widget-wrapper">
                  <div className="widget-default">
                    <div className="widget-header">
                      <h6 className="widget-title">Popular Post</h6>
                    </div>
                    <div className="widget-content">
                      <div className="sidebar-post">
                        <div className="post-single">
                          <div className="d-flex align-items-center">
                            <a href=""><img src={assetUrl('/images/bthumb1.jpg')} alt="" /></a>
                            <p><span>Jan 25, 2018</span> <span>by <a href="">Aazztech</a></span></p>
                          </div>
                          <a href="" className="post-title">Tizara Adds 35 New Part ners envato</a>
                        </div>
                        <div className="post-single">
                          <div className="d-flex align-items-center">
                            <a href=""><img src={assetUrl('/images/bthumb2.jpg')} alt="" /></a>
                            <p><span>Jan 25, 2018</span> <span>by <a href="">Aazztech</a></span></p>
                          </div>
                          <a href="" className="post-title">2018 Decorators opens with home design inspiration</a>
                        </div>
                        <div className="post-single">
                          <div className="d-flex align-items-center">
                            <a href=""><img src={assetUrl('/images/bthumb3.jpg')} alt="" /></a>
                            <p><span>Jan 25, 2018</span> <span>by <a href="">Aazztech</a></span></p>
                          </div>
                          <a href="" className="post-title">Artist brings air of distinction to Delafield apartment</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Post Widget */}
                <div className="widget-wrapper">
                  <div className="widget-default">
                    <div className="widget-header">
                      <h6 className="widget-title">Recent Post</h6>
                    </div>
                    <div className="widget-content">
                      <div className="sidebar-post">
                        <div className="post-single">
                          <div className="d-flex align-items-center">
                            <a href=""><img src={assetUrl('/images/bthumb1.jpg')} alt="" /></a>
                            <p><span>Jan 25, 2018</span> <span>by <a href="">Aazztech</a></span></p>
                          </div>
                          <a href="" className="post-title">Tizara Adds 35 New Part ners envato</a>
                        </div>
                        <div className="post-single">
                          <div className="d-flex align-items-center">
                            <a href=""><img src={assetUrl('/images/bthumb2.jpg')} alt="" /></a>
                            <p><span>Jan 25, 2018</span> <span>by <a href="">Aazztech</a></span></p>
                          </div>
                          <a href="" className="post-title">2018 Decorators opens with home design inspiration</a>
                        </div>
                        <div className="post-single">
                          <div className="d-flex align-items-center">
                            <a href=""><img src={assetUrl('/images/bthumb3.jpg')} alt="" /></a>
                            <p><span>Jan 25, 2018</span> <span>by <a href="">Aazztech</a></span></p>
                          </div>
                          <a href="" className="post-title">Artist brings air of distinction to Delafield apartment</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags Widget */}
                <div className="widget-wrapper">
                  <div className="widget-default">
                    <div className="widget-header">
                      <h6 className="widget-title">Popular Tags</h6>
                    </div>
                    <div className="widget-content">
                      <div className="tags-widget">
                        <ul>
                          <li><a href="">Business</a></li>
                          <li><a href="">Finance</a></li>
                          <li><a href="">Strategy</a></li>
                          <li><a href="">Global</a></li>
                          <li><a href="">Marketing</a></li>
                          <li><a href="">Technology</a></li>
                          <li><a href="">Wordpress</a></li>
                          <li><a href="">Solution</a></li>
                          <li><a href="">Bizillion</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscribe Widget */}
                <div className="widget-wrapper">
                  <div className="widget-default">
                    <div className="widget-header">
                      <h6 className="widget-title">Stay Updated</h6>
                    </div>
                    <div className="widget-content">
                      <div className="subscribe-widget">
                        <form action="#">
                          <input type="email" className="form-control m-bottom-20" placeholder="Enter email" />
                          <button className="btn btn-sm btn-primary shadow-none" type="submit">Subscribe</button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Connect Widget */}
                <div className="widget-wrapper">
                  <div className="widget-default">
                    <div className="widget-header">
                      <h6 className="widget-title">Connect &amp; Follow</h6>
                    </div>
                    <div className="widget-content">
                      <div className="social social--small">
                        <ul className="d-flex flex-wrap">
                          <li><a href="#" className="facebook"><span className="fab fa-facebook-f"></span></a></li>
                          <li><a href="#" className="twitter"><span className="fab fa-twitter"></span></a></li>
                          <li><a href="#" className="instagram"><span className="fab fa-instagram"></span></a></li>
                          <li><a href="#" className="youtube"><span className="fab fa-youtube"></span></a></li>
                          <li><a href="#" className="pinterest"><span className="fab fa-pinterest-p"></span></a></li>
                          <li><a href="#" className="linkedin"><span className="fab fa-linkedin-in"></span></a></li>
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
