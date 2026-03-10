export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin' | 'vendor';
  verified: boolean;
  phone?: string;
  bio?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  memberSince: string;
}

