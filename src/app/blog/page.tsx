import { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import BlogCard from '@/components/blog/BlogCard';
import { getBlogPosts } from '@/lib/api-blog';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - Latest News & Updates',
  description: 'Read our latest articles, news, and industry insights',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog' },
        ]}
        title="Blog & News"
      />

      {/* Blog Section */}
      <section className="blog-area blog-grid section-padding-strict section-bg">
        <div className="container">
          {/* Section Header */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="section-header text-center">
                <h2>Latest Articles</h2>
                <p className="lead">
                  Stay updated with our latest news, tips, and industry insights
                </p>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="row">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} variant="grid" />
            ))}
          </div>

          {/* Load More */}
          <div className="row mt-5">
            <div className="col-12 text-center">
              <button className="btn btn-outline-primary">
                <i className="la la-refresh"></i> Load More Posts
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

