import { DashboardStats as Stats } from '@/types/common';

interface DashboardStatsProps {
  stats: Stats;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      icon: 'la-list',
      label: 'Total Listings',
      value: stats.totalListings,
      color: 'primary',
      change: '+12%',
      changeType: 'increase',
    },
    {
      icon: 'la-eye',
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      color: 'info',
      change: '+23%',
      changeType: 'increase',
    },
    {
      icon: 'la-star',
      label: 'Total Reviews',
      value: stats.totalReviews,
      color: 'warning',
      change: '+5%',
      changeType: 'increase',
    },
    {
      icon: 'la-dollar',
      label: 'Total Earnings',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      color: 'success',
      change: '+18%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="row dashboard-stats">
      {statItems.map((item, index) => (
        <div key={index} className="col-lg-3 col-md-6 mb-4">
          <div className={`stat-card stat-card-${item.color}`}>
            <div className="stat-card-body">
              <div className="stat-icon">
                <i className={`la ${item.icon}`}></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{item.value}</h3>
                <p className="stat-label">{item.label}</p>
                <span className={`stat-change ${item.changeType}`}>
                  <i className={`la la-arrow-${item.changeType === 'increase' ? 'up' : 'down'}`}></i>
                  {item.change} from last month
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

