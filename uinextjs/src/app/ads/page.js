"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import Navbar from '@/components/navbar';
import SocialSidebar from '@/components/SocialSidebar';
import LoginModal from '@/components/LoginModal';

export default function AdsPage() {
  // Demo calculation
  let first = 20;
  let second = 20;
  var sub = first + second;

  // Login Modal State
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const platforms = [
    { name: 'WhatsApp', icon: '💬', color: '#25D366' },
    { name: 'Facebook', icon: '👍', color: '#1877F2' },
    { name: 'Instagram', icon: '📸', color: '#E4405F' },
    { name: 'Telegram', icon: '✈️', color: '#26A5E4' },
    { name: 'X / Twitter', icon: '🐦', color: '#000000' },
    { name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
  ];

  return (
    <>
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <SocialSidebar />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      
      <div className={styles.container}>
        {/* AI Header with Particle Effect */}
        <div className={styles.header}>
          <div className={styles.headerGlow}></div>
          <div className={styles.aiBadge}>
            <span className={styles.pulseDot}></span>
            AI-Powered
          </div>
          <h1 className={styles.title}>
            <span className={styles.gradientText}>Social Ad</span> Creator
          </h1>
          <p className={styles.subtitle}>
            Create social-ready ads in minutes with AI assistance
          </p>
          <p className={styles.description}>
            Pick a platform, use the right image size, and publish polished ads for WhatsApp, Facebook,
            Instagram, Telegram, LinkedIn, YouTube, and your website.
          </p>

          {/* AI Suggestion Badge */}
          <div className={styles.aiSuggestion}>
            <span className={styles.sparkle}>✨</span>
            AI Suggestion: Try our new image optimizer for better engagement
            <span className={styles.sparkle}>✨</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          <div className={styles.actionLeft}>
            <span className={styles.actionLabel}>Create social-ready ads</span>
            <span className={styles.actionSub}>Build a new ad or referral card with the right platform format.</span>
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.primaryButton}>
              <span>➕</span> New Ads
            </button>
            <button className={styles.secondaryButton}>
              <span>🔗</span> Get Referral Link
            </button>
          </div>
        </div>

        {/* Platform Buttons */}
        <div className={styles.platformSection}>
          <div className={styles.platformGrid}>
            {platforms.map((platform) => (
              <button
                key={platform.name}
                className={styles.platformButton}
                style={{ '--platform-color': platform.color }}
              >
                <span className={styles.platformIcon}>{platform.icon}</span>
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        {/* Creative Gallery */}
        <section className={styles.gallerySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.gradientText}>Creative</span> Gallery
            </h2>
            <p className={styles.sectionSubtitle}>
              Fresh ad visuals from live campaigns
            </p>
            <p className={styles.sectionDescription}>
              Browse recent image creatives shaped for fast social sharing.
            </p>
          </div>

          <div className={styles.galleryPlaceholder}>
            <div className={styles.emptyState}>
              <div className={styles.emptyStateAnimation}>
                <span className={styles.emptyIcon}>🖼️</span>
                <div className={styles.rippleEffect}></div>
              </div>
              <p className={styles.emptyStateTitle}>No image ads available yet</p>
              <p className={styles.emptyStateText}>
                Create a new image ad and it will appear here after activation.
              </p>
              <button className={styles.emptyStateButton}>
                Create Your First Ad
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className={styles.featuresSection}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <span className={styles.featureIcon}>✅</span>
            </div>
            <h3 className={styles.featureTitle}>Correct sizes</h3>
            <p className={styles.featureText}>
              Start with platform-ready formats so your image does not crop badly after sharing.
            </p>
            <div className={styles.featureTag}>AI Optimized</div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <span className={styles.featureIcon}>⚡</span>
            </div>
            <h3 className={styles.featureTitle}>Fast publishing</h3>
            <p className={styles.featureText}>
              Create, preview, and share ads without moving through a heavy design workflow.
            </p>
            <div className={styles.featureTag}>One-Click</div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <span className={styles.featureIcon}>🔗</span>
            </div>
            <h3 className={styles.featureTitle}>Referral ready</h3>
            <p className={styles.featureText}>
              Generate referral links and keep new leads connected to the right campaign.
            </p>
            <div className={styles.featureTag}>Smart Tracking</div>
          </div>
        </section>

        {/* Watch & Learn */}
        <section className={styles.watchSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              See How It <span className={styles.gradientText}>Works</span>
            </h2>
            <p className={styles.watchHint}>
              Hover any card to preview · click <span className={styles.watchHighlight}>Watch</span> for the full video
            </p>
          </div>

          <div className={styles.videoGrid}>
            {[1, 2, 3].map((item) => (
              <div key={item} className={styles.videoCard}>
                <div className={styles.videoThumbnail}>
                  <span className={styles.playIcon}>▶</span>
                  <div className={styles.videoDuration}>2:30</div>
                </div>
                <p className={styles.videoTitle}>
                  How can I share an image to reach more people...
                </p>
                <p className={styles.videoDescription}>
                  How do I share an image to increase audience engagement and reach more people?
                </p>
                <button className={styles.watchButton}>
                  Watch Full Video <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerLeft}>
              <span className={styles.footerLang}>ENG</span>
              <span className={styles.footerDivider}>|</span>
              <span className={styles.footerLang}>IN</span>
            </div>
            <div className={styles.footerCenter}>
              <p className={styles.footerText}>Page 1 of 1</p>
              <p className={styles.demoText}>
                Demo: {first} + {second} = <span className={styles.demoResult}>{sub}</span>
              </p>
            </div>
            <div className={styles.footerRight}>
              <span className={styles.footerDate}>29-07-2026</span>
              <button className={styles.footerNext}>Next &gt;</button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}