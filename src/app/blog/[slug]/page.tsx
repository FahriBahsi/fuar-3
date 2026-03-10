import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/common/Breadcrumb';
import { getBlogPostBySlug, getRecentBlogPosts } from '@/lib/api-blog';
import { formatDate, assetUrl } from '@/lib/utils';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const recentPosts = await getRecentBlogPosts(3);

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.category.name, href: `/blog/category/${post.category.slug}` },
          { label: post.title },
        ]}
      />

      {/* Blog Post Section */}
      <section className="blog-area section-padding-strict border-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="post-details">
                <div className="post-head">
                  <img
                    src={assetUrl(post.image)}
                    alt={post.title}
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                </div>
                <div className="post-content">
                  <div className="post-header">
                    <h3>{post.title}</h3>
                    <ul className="list-unstyled">
                      <li>{formatDate(post.publishedAt)}</li>
                      <li>By <Link href={`/author/${post.author.id}`}>{post.author.name}</Link></li>
                      <li>In <Link href={`/blog/category/${post.category.slug}`}>{post.category.name}</Link></li>
                      <li><Link href={`#comments`}>{post.comments} Comments</Link></li>
                    </ul>
                  </div>
                  <div className="post-body">
                    <p>{post.excerpt}</p>
                    <p>{post.content}</p>
                    
                    <div className="m-top-45 m-bottom-50">
                      <blockquote className="blockquote blockquote1">
                        <p>
                          Success in business requires continuous learning and adaptation
                          to new trends and technologies.
                        </p>
                        <div className="quote-author">
                          <p>
                            <span>{post.author.name},</span> {post.category.name} Expert
                          </p>
                        </div>
                      </blockquote>
                    </div>

                    <h4>Key Takeaways</h4>
                    <p>Understanding the fundamentals is crucial for success in any endeavor. Technology continues to shape modern business practices and staying informed helps you make better decisions.</p>
                    
                    <div className="m-bottom-40">
                      <ul className="list-unstyled bullet-list">
                        <li>Build next-generation web applications with a focus on the client</li>
                        <li>Redesign UI's, implement new UI's, and pick up Java as necessary</li>
                        <li>Explore and design dynamic compelling consumer experiences</li>
                        <li>Design and build scalable framework for web applications</li>
                      </ul>
                    </div>

                    <h5>Additional Information</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                  </div>
                </div>
              </div>

              <div className="post-bottom d-flex justify-content-between">
                <div className="tags">
                  <ul className="d-flex list-unstyled">
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <Link href={`/blog/tag/${tag.toLowerCase()}`}>{tag}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="social-share d-flex align-items-center">
                  <span className="m-right-15">Share Post: </span>
                  <ul className="social-share list-unstyled">
                    <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                    <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                    <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                    <li><a href="#"><i className="fab fa-google-plus-g"></i></a></li>
                  </ul>
                </div>
              </div>

              <div className="post-author cardify border">
                <div className="author-thumb">
                  <img
                    src={assetUrl(post.author.avatar)}
                    alt={post.author.name}
                    className="rounded-circle"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
                <div className="author-info">
                  <h5>About <span>{post.author.name}</span></h5>
                  <p>
                    Passionate writer and industry expert sharing insights on business,
                    technology, and innovation. Follow for more great content!
                  </p>
                  <ul className="list-unstyled social-basic">
                    <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                    <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                    <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                    <li><a href="#"><i className="fab fa-google-plus-g"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-md-4">
              <div className="sidebar">
                {/* Recent Posts Widget */}
                <div className="widget-wrapper mb-4">
                  <div className="widget-default">
                    <div className="widget-header">
                      <h6 className="widget-title">Recent Posts</h6>
                    </div>
                    <div className="widget-content">
                      <div className="sidebar-post">
                        {recentPosts.map((recentPost) => (
                          <div key={recentPost.id} className="post-single">
                            <div className="d-flex align-items-center">
                              <Link href={`/blog/${recentPost.slug}`}>
                                <img
                                  src={assetUrl(recentPost.image)}
                                  alt={recentPost.title}
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                              </Link>
                              <p>
                                <span>{formatDate(recentPost.publishedAt)}</span>{' '}
                                <span>
                                  by <Link href={`/author/${recentPost.author.id}`}>{recentPost.author.name}</Link>
                                </span>
                              </p>
                            </div>
                            <Link href={`/blog/${recentPost.slug}`} className="post-title">
                              {recentPost.title}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categories Widget */}
                <div className="widget-wrapper mb-4">
                  <div className="widget-default">
                    <div className="widget-header">
                      <h6 className="widget-title">Categories</h6>
                    </div>
                    <div className="widget-content">
                      <div className="category-widget">
                        <ul>
                          <li className="arrow-list4">
                            <Link href="/blog/category/business">Business</Link>
                          </li>
                          <li className="arrow-list4">
                            <Link href="/blog/category/technology">Technology</Link>
                          </li>
                          <li className="arrow-list4">
                            <Link href="/blog/category/industry">Industry</Link>
                          </li>
                          <li className="arrow-list4">
                            <Link href="/blog/category/news">News</Link>
                          </li>
                        </ul>
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
                          {post.tags.map((tag) => (
                            <li key={tag}>
                              <Link href={`/blog/tag/${tag.toLowerCase()}`}>{tag}</Link>
                            </li>
                          ))}
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

