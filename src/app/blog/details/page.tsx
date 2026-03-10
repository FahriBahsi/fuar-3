import { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Blog Details - Direo',
  description: 'Read our detailed blog post about business and finance',
};

export default function BlogDetailsPage() {
  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'All Listings' },
        ]}
        title="Blog Details"
      />

      {/* Blog Details Area */}
      <section className="blog-area section-padding-strict border-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="post-details">
                <div className="post-head">
                  <img src="/images/b2.jpg" alt="" />
                </div>
                <div className="post-content">
                  <div className="post-header">
                    <h3>Tizara Adds 25 New Partners in Europe</h3>
                    <ul className="list-unstyled">
                      <li>Aug 12, 2019</li>
                      <li>By <a href="">Aazztech</a></li>
                      <li>In <a href="">Finance</a></li>
                      <li><a href="">5 Comments</a></li>
                    </ul>
                  </div>
                  <div className="post-body">
                    <p>Investig ationes demons trave runt lectores legere liusry quod was legunt saepius claritas Investig tones. Pharetra dui, nec tincidunt ante mauris eu diam. Phasellus verra nisl vitae cursus aei uismod supen dise saepius claritas investig. Investiga tiones demonstr averun d lectores legere melius quod kequa legunt saepius. Claritas est etiam pro cessus dynamicus, qui sequitur mutatin onem consuetudium. Investiga tiones demonstr averunt lectores legere me liusked quod kequa legunt saepius.</p>
                    
                    <p>Business and Finance Sequitur mutatin onem consuetudium. Investiga tiones demonstr aver unt lectores legere me lius quod ii qua legunt saepius. Claritas est etiam pro cessus.</p>
                    
                    <div className="m-top-45 m-bottom-50">
                      <blockquote className="blockquote blockquote1">
                        <p>My focus areas are on global standardization and harmonization of business processes lorem dolor is reorganization of marketing and customer.</p>
                        <div className="quote-author">
                          <p><span>Jeff Collins,</span> Founder of Tizara Inc.</p>
                        </div>
                      </blockquote>
                    </div>

                    <h4>Financial Analysis Overview</h4>
                    <p>Investig ationes demons trave runt lectores legere liusry quod was legunt saepius claritas Investig tones. Pharetra dui, nec tincidunt ante mauris eu diam. Phasellus verra nisl vitae cursus aei uismod supen dise saepius claritas investig. Investiga tiones demonstr averun d lectores legere melius.</p>
                    
                    <div className="m-bottom-40">
                      <ul className="list-unstyled bullet-list">
                        <li>Build next-generation web applications with a focus on the client</li>
                        <li>Redesign UI's, implement new UI's, and pick up Java as necessary.</li>
                        <li>Explore and design dynamic compelling consumer experiences.</li>
                        <li>Design and build scalable framework for web applications.</li>
                      </ul>
                    </div>

                    <h5>Elementum Tortorvel Pretium</h5>
                    <p>Investig ationes demons trave runt lectores legere liusry quod was legunt saepius claritas Investig tones. Pharetra dui, nec tincidunt ante mauris eu diam hasellus verra cursus.</p>
                    
                    <div className="row m-bottom-45">
                      <div className="col-lg-5">
                        <img src="/images/c2.jpg" alt="" />
                      </div>
                      <div className="col-lg-7">
                        <p>Investig ationes demons trave runt lectores legere liusry quod was legunt saepius claritas Investig tones haretra dui, nec tincidunt ante mauris eu diam. Phasellus verra nisl vitae cursus aei uismod supen dise saepius claritas legere melius tones haretra.</p>
                      </div>
                    </div>

                    <h5>Financial Analysis Overview</h5>
                    <p>Investig ationes demons trave runt lectores legere liusry quod was legunt saepius claritas Investig tones. Phasellus verrade monstr averun dlectores legere melius verrade monstr averun dlectores.</p>
                    
                    <div className="m-bottom-45">
                      <ul className="list-unstyled">
                        <li>Professional delivers solutions</li>
                        <li>Business human capital research</li>
                        <li>Services complex problems bringing</li>
                        <li>Strategy works with senior executives</li>
                      </ul>
                    </div>

                    <img src="/images/b3.jpg" alt="" />
                    <p className="m-top-30">Investig ationes demons trave runt lectores legere liusry quod was legunt saepius claritas Investig tones. Pharetra dui, nec tincidunt ante mauris eu diam. Phasellus verra nisl vitae cursus aei uismod supen dise saepius claritas investig. Investiga tiones.</p>
                  </div>
                </div>
              </div>

              {/* Post Bottom */}
              <div className="post-bottom d-flex justify-content-between">
                <div className="tags">
                  <ul className="d-flex list-unstyled">
                    <li><a href="">Business</a></li>
                    <li><a href="">Finance</a></li>
                    <li><a href="">Marketing</a></li>
                  </ul>
                </div>
                <div className="social-share d-flex align-items-center">
                  <span className="m-right-15">Share Post: </span>
                  <ul className="social-share list-unstyled">
                    <li><a href=""><i className="fab fa-facebook-f"></i></a></li>
                    <li><a href=""><i className="fab fa-twitter"></i></a></li>
                    <li><a href=""><i className="fab fa-linkedin-in"></i></a></li>
                    <li><a href=""><i className="fab fa-google-plus-g"></i></a></li>
                  </ul>
                </div>
              </div>

              {/* Post Author */}
              <div className="post-author cardify border">
                <div className="author-thumb">
                  <img src="/images/auth1.png" alt="" className="rounded-circle" />
                </div>
                <div className="author-info">
                  <h5>About <span>Aazztech</span></h5>
                  <p>Business and Finance Sequitur mutatin onem consuetudium. Investiga tiones demonstr aver unt lectores legere me lius quod kqua legunt saepius. Claritas est etiam pro cessus averus.</p>
                  <ul className="list-unstyled social-basic">
                    <li><a href=""><i className="fab fa-facebook-f"></i></a></li>
                    <li><a href=""><i className="fab fa-twitter"></i></a></li>
                    <li><a href=""><i className="fab fa-linkedin-in"></i></a></li>
                    <li><a href=""><i className="fab fa-google-plus-g"></i></a></li>
                  </ul>
                </div>
              </div>

              {/* Post Pagination */}
              <div className="post-pagination">
                <div className="prev-post">
                  <span>Previous Post:</span>
                  <a href="" className="title">How to Run a Successful Business Meeting</a>
                  <p><span>Aug 12, 2019</span> - In <a href="">Industry</a></p>
                </div>
                <div className="next-post">
                  <span>Next Post:</span>
                  <a href="" className="title">Exciting New Technologies Business</a>
                  <p><span>Aug 12, 2019</span> - In <a href="">Industry</a></p>
                </div>
              </div>

              {/* Related Posts */}
              <div className="related-post m-top-60">
                <div className="related-post--title">
                  <h3>Related Post</h3>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-sm-6">
                    <div className="single-post">
                      <img src="/images/e4.jpg" alt="" />
                      <h6><a href="">Tizara Starts Solutions Alliance Program</a></h6>
                      <p><span>Aug 12, 2019</span> - In <a href="">Industry</a></p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-sm-6">
                    <div className="single-post">
                      <img src="/images/e5.jpg" alt="" />
                      <h6><a href="">How to Run a Successful Business Meeting</a></h6>
                      <p><span>Aug 12, 2019</span> - In <a href="">Industry</a></p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-sm-6">
                    <div className="single-post">
                      <img src="/images/e6.jpg" alt="" />
                      <h6><a href="">Global Market Grows to $600 Billion</a></h6>
                      <p><span>Aug 12, 2019</span> - In <a href="">Industry</a></p>
                    </div>
                  </div>
                </div>
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
                            <a href=""><img src="/images/bthumb1.jpg" alt="" /></a>
                            <p><span>Jan 25, 2018</span> <span>by <a href="">Aazztech</a></span></p>
                          </div>
                          <a href="" className="post-title">Tizara Adds 35 New Part ners envato</a>
                        </div>
                        <div className="post-single">
                          <div className="d-flex align-items-center">
                            <a href=""><img src="/images/bthumb2.jpg" alt="" /></a>
                            <p><span>Jan 25, 2018</span> <span>by <a href="">Aazztech</a></span></p>
                          </div>
                          <a href="" className="post-title">2018 Decorators opens with home design inspiration</a>
                        </div>
                        <div className="post-single">
                          <div className="d-flex align-items-center">
                            <a href=""><img src="/images/bthumb3.jpg" alt="" /></a>
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
                            <a href=""><img src="/images/bthumb1.jpg" alt="" /></a>
                            <p><span>Jan 25, 2018</span> <span>by <a href="">Aazztech</a></span></p>
                          </div>
                          <a href="" className="post-title">Tizara Adds 35 New Part ners envato</a>
                        </div>
                        <div className="post-single">
                          <div className="d-flex align-items-center">
                            <a href=""><img src="/images/bthumb2.jpg" alt="" /></a>
                            <p><span>Jan 25, 2018</span> <span>by <a href="">Aazztech</a></span></p>
                          </div>
                          <a href="" className="post-title">2018 Decorators opens with home design inspiration</a>
                        </div>
                        <div className="post-single">
                          <div className="d-flex align-items-center">
                            <a href=""><img src="/images/bthumb3.jpg" alt="" /></a>
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
