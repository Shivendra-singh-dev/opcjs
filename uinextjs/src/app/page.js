﻿"use client";

import Image from "next/image";
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
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Welcome to Our<br />
              <span className={styles.highlight}>Modern Platform</span>
            </h1>
            <p className={styles.heroDescription}>
              Build amazing experiences with Next.js and modern UI components.
              Get started quickly with our pre-built templates.
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
              <Link href="/about" className={styles.secondaryBtn}>
                Learn More
              </Link>
            </div>
          </div>

          <div className={styles.heroImage}>
            <div className={styles.imagePlaceholder}>
              <Image src="/vercel.svg" alt="Hero illustration" width={200} height={200} className={styles.heroIllustration} />
            </div>
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <h3>Fast &amp; Reliable</h3>
            <p>Built on Next.js for optimal performance and SEO</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3>Modern UI</h3>
            <p>Beautiful components with smooth animations</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Secure</h3>
            <p>Enterprise-grade security out of the box</p>
          </div>
        </div>
      </main>
    </div>
  );
}
