export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  views: number;
  comments: number;
}

