import { Outlet } from 'react-router-dom';
import { Zap } from 'lucide-react';
import styles from './AuthLayout.module.css';

const FEATURES = [
  'Simultaneous SOC, SOH & RUL prediction via AHRF',
  'SHAP-based explainability & feature selection',
  'Optuna hyperparameter optimization',
  'Rule-based maintenance decision support',
];

export function AuthLayout() {
  return (
    <div className={styles.authLayout}>
      <aside className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <div className={styles.brandLogo}>
            <div className={styles.brandIcon}>
              <Zap size={24} />
            </div>
            <div>
              <div className={styles.brandTitle}>ElectraBrain</div>
              <div className={styles.brandTagline}>AI Battery Management System</div>
            </div>
          </div>

          <h1 className={styles.brandHeading}>
            Adaptive Hybrid Random Forest for Intelligent BMS
          </h1>
          <p className={styles.brandDescription}>
            Research-driven platform for lithium-ion battery state estimation,
            degradation analysis, and predictive maintenance using NASA dataset methodology.
          </p>

          <ul className={styles.featureList}>
            {FEATURES.map((feature) => (
              <li key={feature} className={styles.featureItem}>
                <span className={styles.featureDot} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className={styles.panel}>
        <div className={styles.card}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
