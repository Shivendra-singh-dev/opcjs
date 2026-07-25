"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";
import Navbar from "../../components/navbar.js";

export default function Signup() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className={styles.page}>
      <Navbar/>

      {/* Auth Content */}
      <main className={styles.main}>
        <div className={styles.authContainer}>
          {/* Left Column - Auth Form */}
          <div className={styles.authForm}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                <p className={styles.formSubtitle}>
                  {isLogin 
                    ? "Sign in to access your account" 
                    : "Join us and start your journey"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                {!isLogin && (
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name</label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>👤</span>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.formInput}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>✉️</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Password</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={styles.formInput}
                      required
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>🔐</span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={styles.formInput}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className={styles.formOptions}>
                    <label className={styles.checkbox}>
                      <input type="checkbox" />
                      <span>Remember me</span>
                    </label>
                    <Link href="/forgot-password" className={styles.forgotLink}>
                      Forgot password?
                    </Link>
                  </div>
                )}

                <button type="submit" className={styles.submitBtn}>
                  {isLogin ? "Sign In" : "Create Account"}
                  <svg className={styles.btnIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </form>

              <div className={styles.divider}>
                <span>or continue with</span>
              </div>

              <div className={styles.socialAuth}>
                <button className={styles.socialBtn}>
                  <span>Google</span>
                </button>
                <button className={styles.socialBtn}>
                  <span>GitHub</span>
                </button>
                <button className={styles.socialBtn}>
                  <span>Twitter</span>
                </button>
              </div>

              <div className={styles.formFooter}>
                <p>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    type="button"
                    onClick={toggleMode}
                    className={styles.toggleBtn}
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Auth Info */}
          <div className={styles.authInfo}>
            <div className={styles.infoContent}>
              <div className={styles.infoBadge}>
                <span>✨</span>
                <span>Welcome</span>
              </div>
              <h2 className={styles.infoTitle}>
                {isLogin 
                  ? "Good to see you again!" 
                  : "Join Our Community"}
              </h2>
              <p className={styles.infoDescription}>
                {isLogin 
                  ? "Sign in to access your dashboard, manage your projects, and connect with our community." 
                  : "Create your account and unlock a world of possibilities. Join thousands of satisfied users."}
              </p>

              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>✅</span>
                  <span>Secure & private account</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>🚀</span>
                  <span>Access to premium features</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>👥</span>
                  <span>Connect with the community</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>📊</span>
                  <span>Track your progress</span>
                </div>
              </div>

              <div className={styles.testimonial}>
                <div className={styles.testimonialAvatar}>👤</div>
                <div className={styles.testimonialContent}>
                  <p>This platform transformed how I work. The user experience is exceptional!</p>
                  <div className={styles.testimonialAuthor}>
                    <strong>Sarah Johnson</strong>
                    <span>Product Designer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}