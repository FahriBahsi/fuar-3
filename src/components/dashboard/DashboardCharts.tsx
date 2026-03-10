'use client';

interface ChartData {
  labels: string[];
  views: number[];
  bookings: number[];
}

interface DashboardChartsProps {
  data: ChartData;
}

export default function DashboardCharts({ data }: DashboardChartsProps) {
  const { labels, views, bookings } = data;

  // Find max value for scaling
  const maxValue = Math.max(...views, ...bookings);

  return (
    <div className="dashboard-charts">
      <div className="chart-card">
        <div className="chart-header">
          <h5>Views & Bookings Overview</h5>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color" style={{ background: '#667eea' }}></span>
              Views
            </span>
            <span className="legend-item ml-3">
              <span className="legend-color" style={{ background: '#28a745' }}></span>
              Bookings
            </span>
          </div>
        </div>
        <div className="chart-body">
          <div className="simple-bar-chart">
            <div className="chart-bars">
              {labels.map((label, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="bars">
                    <div
                      className="bar bar-views"
                      style={{
                        height: `${(views[index] / maxValue) * 200}px`,
                        background: '#667eea',
                      }}
                      title={`Views: ${views[index]}`}
                    ></div>
                    <div
                      className="bar bar-bookings"
                      style={{
                        height: `${(bookings[index] / maxValue) * 200}px`,
                        background: '#28a745',
                      }}
                      title={`Bookings: ${bookings[index]}`}
                    ></div>
                  </div>
                  <div className="bar-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="chart-footer">
          <p className="text-muted text-center">
            <i className="la la-info-circle"></i> Data shows monthly trends over the last 6 months
          </p>
        </div>
      </div>

      <style jsx>{`
        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        [data-theme='dark'] .chart-card {
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e3e6ef;
        }

        [data-theme='dark'] .chart-header {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .chart-header h5 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        [data-theme='dark'] .chart-header h5 {
          color: #ffffff;
        }

        .chart-legend {
          display: flex;
        }

        .legend-item {
          display: flex;
          align-items: center;
          font-size: 14px;
        }

        [data-theme='dark'] .legend-item {
          color: rgba(255, 255, 255, 0.85);
        }

        .legend-color {
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 3px;
          margin-right: 6px;
        }

        .simple-bar-chart {
          padding: 20px 0;
        }

        .chart-bars {
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          height: 250px;
          border-bottom: 2px solid #e3e6ef;
          padding: 0 10px;
        }

        [data-theme='dark'] .chart-bars {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .chart-bar-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 100px;
        }

        .bars {
          display: flex;
          gap: 4px;
          align-items: flex-end;
          height: 200px;
        }

        .bar {
          width: 24px;
          border-radius: 4px 4px 0 0;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .bar:hover {
          opacity: 0.8;
          transform: translateY(-2px);
        }

        .bar-label {
          margin-top: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #666;
        }

        [data-theme='dark'] .bar-label {
          color: rgba(255, 255, 255, 0.7);
        }

        .chart-footer {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #e3e6ef;
        }

        [data-theme='dark'] .chart-footer {
          border-top-color: rgba(255, 255, 255, 0.1);
        }

        [data-theme='dark'] .chart-footer .text-muted {
          color: rgba(255, 255, 255, 0.6) !important;
        }
      `}</style>
    </div>
  );
}

