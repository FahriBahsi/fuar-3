import { BlogPost } from '@/types/blog';
import blogData from '@/data/blog-posts.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all blog posts
 */
export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  await delay(50);
  const posts = blogData.posts as BlogPost[];
  return limit ? posts.slice(0, limit) : posts;
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  await delay(50);
  const post = blogData.posts.find(p => p.slug === slug);
  return post ? (post as BlogPost) : null;
}

/**
 * Get recent blog posts
 */
export async function getRecentBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  await delay(50);
  const posts = blogData.posts.slice(0, limit);
  return posts as BlogPost[];
}

