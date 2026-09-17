import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import styles from './DashboardPage.module.css';
import { MetricCard } from '@/components/ui/MetricCard/MetricCard';
import { ChartCard } from '@/components/ui/ChartCard/ChartCard';
import { DonutChart } from '@/components/charts/DonutChart/DonutChart';
import { LineChart } from '@/components/charts/LineChart/LineChart';
import { BarChart } from '@/components/charts/BarChart/BarChart';
import {
  KPI_STATS,
  SOH_DISTRIBUTION,
  SOH_TREND,
  RUL_PREDICTION,
  BATTERY_STATUS_ROWS,
  DEGRADATION_SERIES,
  HEALTH_RADAR,
  RECENT_ALERTS,
  MODEL_PERFORMANCE,
  SYSTEM_OVERVIEW,
} from '@/mocks/dashboard';
export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader title="Dashboard" subtitle="Overview of system health and predictions" />

      <div className={styles.grid}>
        <div className={styles.row1}>
          <MetricCard label="Total Batteries" value={KPI_STATS.totalBatteries} />
          <MetricCard label="Average SOH" value={`${KPI_STATS.averageSoh}%`} />
          <MetricCard label="Predicted RUL Avg" value={`${KPI_STATS.predictedRulAvg} cycles`} />
          <MetricCard label="Active Alerts" value={KPI_STATS.activeAlerts} />
        </div>

        <div className={styles.row2}>
          <ChartCard title="SOH Distribution">
            <DonutChart data={SOH_DISTRIBUTION} height={240} innerRadius="60%" />
          </ChartCard>

          <ChartCard title="SOH Trend">
            <LineChart data={SOH_TREND} xKey="label" series={[{ dataKey: 'soh', name: 'SOH' }]} />
          </ChartCard>

          <ChartCard title="RUL Predictions">
            <BarChart
              data={RUL_PREDICTION}
              xKey="label"
              bars={[{ dataKey: 'rul', name: 'RUL' }]}
            />
          </ChartCard>
        </div>

        <div className={styles.row3}>
          <ChartCard title="Degradation (Actual vs Predicted)">
            <LineChart
              data={DEGRADATION_SERIES as any}
              xKey="cycle"
              series={[{ dataKey: 'actual', name: 'Actual' }, { dataKey: 'predicted', name: 'Predicted' }]}
              height={220}
            />
          </ChartCard>

          <ChartCard title="Health Indicators">
            <BarChart data={HEALTH_RADAR as any} xKey="metric" bars={[{ dataKey: 'value', name: 'Score' }]} />
          </ChartCard>

          <ChartCard title="Model Performance">
            <div className={styles.modelPerf}>
              <div>
                <div className="label">MAE</div>
                <div className="value">{MODEL_PERFORMANCE.mae}</div>
              </div>
              <div>
                <div className="label">R²</div>
                <div className="value">{MODEL_PERFORMANCE.r2}</div>
              </div>
              <div className={styles.modelLink}>
                <Link to="/ai/model-comparison">View model metrics →</Link>
              </div>
            </div>
          </ChartCard>
        </div>

        <div className={styles.row4}>
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3>Recent Batteries</h3>
              <Link to="/batteries">View all batteries →</Link>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>SOH</th>
                  <th>SOC</th>
                  <th>Status</th>
                  <th>RUL</th>
                </tr>
              </thead>
              <tbody>
                {BATTERY_STATUS_ROWS.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Link to={`/batteries/${r.id}`}>{r.id}</Link>
                    </td>
                    <td>{r.soh}%</td>
                    <td>{r.soc}%</td>
                    <td>{r.status}</td>
                    <td>{r.rul}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.alertsCard}>
            <div className={styles.tableHeader}>
              <h3>Recent Alerts</h3>
              <Link to="/alerts">View all alerts →</Link>
            </div>
            <ul className={styles.alertList}>
              {RECENT_ALERTS.map((a, i) => (
                <li key={i}>
                  <div className={styles.alertTitle}>{a.title}</div>
                  <div className={styles.alertMsg}>{a.message}</div>
                  <div className={styles.alertMeta}>{a.time}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.systemCard}>
            <h3>System Overview</h3>
            <div className={styles.systemGrid}>
              <div>Data sources: {SYSTEM_OVERVIEW.dataSources}</div>
              <div>Last sync: {SYSTEM_OVERVIEW.lastSync}</div>
              <div>Models deployed: {SYSTEM_OVERVIEW.modelsDeployed}</div>
              <div>Uptime: {SYSTEM_OVERVIEW.uptime}</div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
