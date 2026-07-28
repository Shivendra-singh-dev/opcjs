"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./LoginModal.module.css";

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!emailOrMobile || !password) {
      setError("Please enter email/mobile and password");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrMobile, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        onClose();
        router.push("/dashboard");
      } else {
        setError(data.error || "Invalid email/mobile or password");
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => { setError("Google login coming soon!"); };
  const handleGithubLogin = () => { setError("GitHub login coming soon!"); };
  const handleTwitterLogin = () => { setError("Twitter login coming soon!"); };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>X</button>
        <div className={styles.modalHeader}>
          <div className={styles.modalIcon}>LOCK</div>
          <h2 className={styles.modalTitle}>Welcome Back</h2>
          <p className={styles.modalSubtitle}>Sign in to access your dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="loginEmailOrMobile">Email or Mobile</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>@</span>
              <input type="text" id="loginEmailOrMobile" placeholder="Email or mobile number" value={emailOrMobile} onChange={(e) => setEmailOrMobile(e.target.value)} className={styles.formInput} required autoFocus />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="loginPassword">Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>*</span>
              <input type={showPassword ? "text" : "password"} id="loginPassword" placeholder="......" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.formInput} required />
              <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "HIDE" : "SHOW"}</button>
            </div>
          </div>
          <div className={styles.formOptions}>
            <label className={styles.checkbox}><input type="checkbox" /><span>Remember me</span></label>
            <Link href="/forgot-password" className={styles.forgotLink} onClick={onClose}>Forgot password?</Link>
          </div>
          {error && <div className={styles.errorMessage}><span>!</span> {error}</div>}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className={styles.divider}><span>or continue with</span></div>
        <div className={styles.socialAuth}>
          <button type="button" className={styles.socialBtn} onClick={handleGoogleLogin}><span>Google</span></button>
          <button type="button" className={styles.socialBtn} onClick={handleGithubLogin}><span>GitHub</span></button>
          <button type="button" className={styles.socialBtn} onClick={handleTwitterLogin}><span>Twitter</span></button>
        </div>
        <div className={styles.modalFooter}>
          <p>Don&apos;t have an account? <Link href="/signup" className={styles.signupLink} onClick={onClose}>Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}
