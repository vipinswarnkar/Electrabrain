import { Link } from 'react-router-dom';
import styles from './AuthPages.module.css';

export function SignupPage() {
  return (
    <div className={styles.authForm}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Join ElectraBrain for AI-powered battery analytics</p>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            Full Name
          </label>
          <input id="name" type="text" className={styles.input} placeholder="Dr. Sarah Chen" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="signup-email">
            Email
          </label>
          <input id="signup-email" type="email" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="signup-password">
            Password
          </label>
          <input id="signup-password" type="password" className={styles.input} />
        </div>
        <button type="submit" className={styles.submit}>
          Create Account
        </button>
      </form>

      <p className={styles.footer}>
        Already have an account?{' '}
        <Link to="/login" className={styles.link}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
