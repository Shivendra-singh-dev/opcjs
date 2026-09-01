﻿"use client";

import Link from "next/link";
import { useState } from "react";
import SocialSidebar from "@/components/SocialSidebar";
import styles from "./page.module.css";
import Navbar from "@/components/navbar";
import LoginModal from "@/components/LoginModal";

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className={styles.page}>
      <SocialSidebar />
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.kicker}>Creative growth platform</span>
            <h1 className={styles.heroTitle}>
              Turn ideas into
              <span className={styles.highlight}> high-impact ads</span>
            </h1>
            <p className={styles.heroDescription}>
              Launch polished campaigns, build smart content workflows, and scale your brand with a streamlined platform that keeps marketing simple and fast.
            </p>

            <div className={styles.heroButtons}>
              <button onClick={() => setLoginOpen(true)} className={styles.loginBtn}>
                Login
                <svg className={styles.btnIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <Link href="/signup" className={styles.primaryBtn}>
                Get Started
                <svg className={styles.btnIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.statCard}>
                <strong>120K+</strong>
                <span>campaigns launched</span>
              </div>
              <div className={styles.statCard}>
                <strong>4.9/5</strong>
                <span>customer rating</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={`${styles.orb} ${styles.orbOne}`} />
            <div className={`${styles.orb} ${styles.orbTwo}`} />
            <div className={styles.dashboardCard}>
              <div className={styles.cardTopbar}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.metricRow}>
                  <div>
                    <p>Reach</p>
                    <h3>2.4M</h3>
                  </div>
                  <span className={styles.pill}>+18.2%</span>
                </div>
                <div className={styles.graph}>
                  <span className={styles.bar1} />
                  <span className={styles.bar2} />
                  <span className={styles.bar3} />
                  <span className={styles.bar4} />
                  <span className={styles.bar5} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <h3>Fast &amp; Reliable</h3>
            <p>Built for quick launches and efficient team workflows.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3>Modern UI</h3>
            <p>Clean, premium experiences designed to convert attention.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Secure</h3>
            <p>Safe access, trusted tools, and a scalable platform.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
