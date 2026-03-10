export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  count: number;
  parent?: string;
  featured: boolean;
}

