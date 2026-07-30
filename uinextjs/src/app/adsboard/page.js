"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import Navbar from '@/components/navbar';
import SocialSidebar from '@/components/SocialSidebar';
import LoginModal from '@/components/LoginModal';
import AdCreationModal from '@/components/AdCreationModal';

export default function AdsBoard() {
  // Demo calculation
  let first = 20;
  let second = 20;
  var sub = first + second;

  // Login Modal State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdCreationOpen, setIsAdCreationOpen] = useState(false);
  const [ads, setAds] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const platforms = [
    { name: 'WhatsApp', icon: '💬', color: '#25D366' },
    { name: 'Facebook', icon: '👍', color: '#1877F2' },
    { name: 'Instagram', icon: '📸', color: '#E4405F' },
    { name: 'Telegram', icon: '✈️', color: '#26A5E4' },
    { name: 'X / Twitter', icon: '🐦', color: '#000000' },
    { name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
  ];

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handleCreateAd = (adData) => {
    const newAd = {
      id: Date.now(),
      ...adData,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    setAds([newAd, ...ads]);
    setIsAdCreationOpen(false);
  };

  const handleNewAdClick = () => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }
    setIsAdCreationOpen(true);
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    if (isLoggedIn) {
      setIsAdCreationOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <>
      <Navbar 
        onLoginClick={() => setIsLoginOpen(true)} 
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
      />
      <SocialSidebar />
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />
      <AdCreationModal 
        isOpen={isAdCreationOpen}
        onClose={() => setIsAdCreationOpen(false)}
        onCreateAd={handleCreateAd}
        selectedPlatform={selectedPlatform}
        platforms={platforms}
      />
      
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
            <span className={styles.actionLabel}>
              {isLoggedIn ? `Welcome back! ${ads.length} ads created` : 'Create social-ready ads'}
            </span>
            <span className={styles.actionSub}>
              {isLoggedIn 
                ? `You have ${ads.filter(ad => ad.status === 'published').length} published ads`
                : 'Build a new ad or referral card with the right platform format.'
              }
            </span>
          </div>
          <div className={styles.actionButtons}>
            <button 
              className={styles.primaryButton}
              onClick={handleNewAdClick}
            >
              <span>➕</span> {isLoggedIn ? 'Create New Ad' : 'Login to Create Ad'}
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
                className={`${styles.platformButton} ${selectedPlatform?.name === platform.name ? styles.activePlatform : ''}`}
                style={{ '--platform-color': platform.color }}
                onClick={() => handlePlatformSelect(platform)}
              >
                <span className={styles.platformIcon}>{platform.icon}</span>
                {platform.name}
                {selectedPlatform?.name === platform.name && (
                  <span className={styles.selectedBadge}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* My Ads Section - Only visible when logged in */}
        {isLoggedIn && (
          <section className={styles.myAdsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.gradientText}>My</span> Ads
              </h2>
              <p className={styles.sectionSubtitle}>
                Manage your created ads
              </p>
              <button 
                className={styles.createAdButton}
                onClick={() => setIsAdCreationOpen(true)}
              >
                + Create New Ad
              </button>
            </div>

            <div className={styles.adsGrid}>
              {ads.length > 0 ? (
                ads.map((ad) => (
                  <div key={ad.id} className={styles.adCard}>
                    <div className={styles.adCardHeader}>
                      <span className={styles.adPlatform}>{ad.platform}</span>
                      <span className={`${styles.adStatus} ${styles[ad.status]}`}>
                        {ad.status}
                      </span>
                    </div>
                    <h3 className={styles.adTitle}>{ad.title}</h3>
                    <p className={styles.adDescription}>{ad.description}</p>
                    {ad.image && (
                      <div className={styles.adImage}>
                        <img src={ad.image} alt={ad.title} />
                      </div>
                    )}
                    <div className={styles.adCardFooter}>
                      <span className={styles.adDate}>
                        {new Date(ad.createdAt).toLocaleDateString()}
                      </span>
                      <div className={styles.adActions}>
                        <button className={styles.adActionButton}>Edit</button>
                        <button className={styles.adActionButton}>Preview</button>
                        <button className={styles.adActionButton}>Publish</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateAnimation}>
                    <span className={styles.emptyIcon}>📝</span>
                  </div>
                  <p className={styles.emptyStateTitle}>No ads created yet</p>
                  <p className={styles.emptyStateText}>
                    Click the &quot;Create New Ad&quot; button to get started
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

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
              <button 
                className={styles.emptyStateButton}
                onClick={handleNewAdClick}
              >
                {isLoggedIn ? 'Create Your First Ad' : 'Login to Create Ad'}
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