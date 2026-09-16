'use client';

import styles from '@/styles/UserProfile.module.css';

export default function UserProfile() {
  return (
    <div className={styles.userProfile}>
      <div className={styles.avatar}>E</div>
      <div className={styles.userInfo}>
        <h3 className={styles.userName}>Eduardo Oliveira</h3>
        <p className={styles.username}>@eduardo2liveira</p>
      </div>
    </div>
  );
}