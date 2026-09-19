import { Link } from 'react-router-dom';
import styles from './AuthPages.module.css';

export function ForgotPasswordPage() {
  return (
    <div className={styles.authForm}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reset password</h1>
        <p className={styles.subtitle}>
          Enter your email and we&apos;ll send a reset link (mock flow for now)
        </p>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reset-email">
            Email
          </label>
          <input id="reset-email" type="email" className={styles.input} />
        </div>
        <button type="submit" className={styles.submit}>
          Send Reset Link
        </button>
      </form>

      <p className={styles.footer}>
        <Link to="/login" className={styles.link}>
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
