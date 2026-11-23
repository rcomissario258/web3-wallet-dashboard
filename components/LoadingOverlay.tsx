'use client';

import styles from '@/styles/LoadingOverlay.module.css';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
}

export default function LoadingOverlay({ isVisible, message = 'Processando...', progress }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>
          <div className={styles.spinnerCircle}></div>
          <div className={styles.spinnerCircle}></div>
          <div className={styles.spinnerCircle}></div>
          <div className={styles.spinnerCircle}></div>
        </div>
        <div className={styles.loadingText}>{message}</div>
        {progress !== undefined && (
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <div className={styles.loadingDots}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
      </div>
    </div>
  );
}
