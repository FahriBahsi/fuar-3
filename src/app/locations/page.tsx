import { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import LocationCard from '@/components/locations/LocationCard';
import { getAllLocations } from '@/lib/api';

export const metadata: Metadata = {
  title: 'All Locations - Browse by Location',
  description: 'Explore businesses in different cities and locations',
};

export default async function LocationsPage() {
  const locations = await getAllLocations();

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'All Listings' },
        ]}
        title="All Locations"
      />

      {/* Locations Section */}
      <section className="section-padding-strict section-bg">
        <div className="atbd_location_grid_wrap">
          <div className="container">
            <div className="row">
              {locations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  variant="original"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

