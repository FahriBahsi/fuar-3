import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { formatDate, assetUrl } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'grid' | 'list';
}

export default function BlogCard({ post, variant = 'grid' }: BlogCardProps) {
  const { title, slug, excerpt, image, category, author, publishedAt, comments, views } = post;

  if (variant === 'list') {
    return (
      <div className="blog-single">
        <div className="card post--card post--card2">
          <figure>
            <Link href={`/blog/${slug}`}>
              <img
                src={assetUrl(image)}
                alt={title}
                className="img-cover"
              />
            </Link>
            <figcaption>
              <Link href={`/blog/${slug}`}>
                <i className="la la-image"></i>
              </Link>
            </figcaption>
          </figure>
          <div className="card-body">
            <h3>
              <Link href={`/blog/${slug}`}>{title}</Link>
            </h3>
            <ul className="post-meta list-unstyled">
              <li>{formatDate(publishedAt)}</li>
              <li>
                by <Link href={`/author/${author.id}`}>{author.name}</Link>
              </li>
              <li>
                in <Link href={`/blog/category/${category.slug}`}>{category.name}</Link>
              </li>
              <li>
                <Link href={`/blog/${slug}#comments`}>{comments} Comments</Link>
              </li>
            </ul>
            <p>{excerpt}</p>
          </div>
        </div>
      </div>
    );
  }

  // Grid variant - matches original template structure
  return (
    <div className="col-lg-4 col-md-6">
      <div className="grid-single">
        <div className="card post--card shadow-sm">
          <figure>
            <Link href={`/blog/${slug}`}>
              <img
                src={assetUrl(image)}
                alt={title}
                className="img-cover"
              />
            </Link>
          </figure>
          <div className="card-body">
            <h6>
              <Link href={`/blog/${slug}`}>{title}</Link>
            </h6>
            <ul className="post-meta d-flex list-unstyled">
              <li>{formatDate(publishedAt)}</li>
              <li>
                in <Link href={`/blog/category/${category.slug}`}>{category.name}</Link>
              </li>
            </ul>
            <p>{excerpt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

