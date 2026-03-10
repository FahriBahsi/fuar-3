import { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import BlogCard from '@/components/blog/BlogCard';
import { getBlogPosts } from '@/lib/api-blog';

export const metadata: Metadata = {
  title: 'Blog Grid Layout - Direo',
  description: 'Browse our blog posts in a beautiful grid layout',
};

export default async function BlogGridPage() {
  const posts = await getBlogPosts();
  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'All Listings' },
        ]}
        title="Blog Grid Layout"
      />

      {/* Blog Grid Area */}
      <section className="blog-area blog-grid section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} variant="grid" />
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
      </section>
    </>
  );
}
