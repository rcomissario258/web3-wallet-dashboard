'use client';

import styles from '@/styles/AutotradeEngine.module.css';

export default function AutotradeEngine() {
  return (
    <div className={styles.autotradeEngine}>
      <div className={styles.engineHeader}>
        <div className={styles.engineIcon}>🤖</div>
        <div className={styles.engineTitle}>
          <h3>AUTOTRADE IA</h3>
          <span className={styles.engineStatus}>Status: ● Sistema activo</span>
        </div>
      </div>

      <div className={styles.engineMetrics}>
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Estratégia IA</span>
          <span className={styles.metricValue}>Conservative</span>
        </div>
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Performance</span>
          <span className={`${styles.metricValue} ${styles.performance}`}>+16.8%</span>
        </div>
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Trades executados</span>
          <span className={styles.metricValue}>1,247</span>
        </div>
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Última actividade</span>
          <span className={styles.metricValue}>12 Sep 2026 · 18:04</span>
        </div>
      </div>
    </div>
  );
}