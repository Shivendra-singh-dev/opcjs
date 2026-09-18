"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";
import Navbar from "../../components/navbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to process the request.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar/>

      <main className={styles.main}>
        <div className={styles.forgotContainer}>
          <div className={styles.forgotCard}>
            <div className={styles.forgotHeader}>
              <h1 className={styles.forgotTitle}>🔐 Reset Password</h1>
              <p className={styles.forgotSubtitle}>
                Enter your email address all send you a link to reset your password.
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>✉️</span>
                    <input
                      type="email"
                      id="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  {loading ? "Sending..." : "Send Reset Link"}
                  <svg className={styles.btnIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                {error && <p className={styles.errorMessage}>{error}</p>}

                <div className={styles.backLink}>
                  <Link href="/signup">← Back to Sign In</Link>
                </div>
              </form>
            ) : (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✅</div>
                <h2>Check Your Email</h2>
                <p>
                  We ve sent a password reset link to <strong>{email}</strong>.
                  Please check your inbox and follow the instructions.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className={styles.submitBtn}
                >
                  Try Another Email
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}