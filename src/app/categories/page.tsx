import { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import CategoryCard from '@/components/categories/CategoryCard';
import { getCategories } from '@/lib/api';

export const metadata: Metadata = {
  title: 'All Categories - Browse by Category',
  description: 'Explore all business categories and find what you\'re looking for',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'All Listings' },
        ]}
        title="All Categories"
      />

      {/* Categories Section */}
      <section className="section-padding-1_7 border-bottom">
        <div className="container">
          <div className="row">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                variant="original"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

