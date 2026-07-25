'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './dashboard.module.css';

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/contacts', label: 'Contacts', icon: '📞' },
    { href: '/users', label: 'Users', icon: '👤' },
  ];

  return (
    <div className={styles.dashboardRoot}>
      {/* Mobile Menu Toggle */}
      <button
        className={styles.mobileMenuToggle}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <span className={`${styles.hamburger} ${mobileOpen ? styles.active : ''}`} />
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarBrand}>
          <div className={styles.brandMark}>🤖</div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>AI Dashboard</span>
            <span className={styles.brandSub}>Analytics Hub</span>
          </div>
        </div>

        {/* AI Status */}
        <div className={styles.aiStatus}>
          <div className={styles.aiPulse} />
          <span className={styles.aiText}>AI System Online</span>
          <span className={styles.aiBadge}>v3.2</span>
        </div>

        {/* Navigation */}
        <nav className={styles.sidebarNav}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.sidebarLink} ${isActive ? styles.active : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className={styles.linkIcon}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.miniCard}>
            <div className={styles.miniCardTitle}>🚀 AI Performance</div>
            <span className={styles.pill}>98.7% Uptime</span>
            <div className={styles.miniCardSub}>Last 30 days · All systems go</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainWrapper}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <div className={styles.topbarInner}>
            <div className={styles.breadcrumb}>
              <span>/</span>
              <span className={styles.crumbCurrent}>
                {pathname === '/dashboard' ? 'Dashboard' : 'Contacts'}
              </span>
              <span className={styles.aiIndicator}>🤖 AI Powered</span>
            </div>

            <div className={styles.topbarActions}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search anything..."
                />
                <span className={styles.searchShortcut}>⌘K</span>
              </div>

              <div className={styles.profileChip}>
                <span className={styles.notificationDot} />
                <div className={styles.profileText}>
                  <span className={styles.profileName}>Admin User</span>
                  <span className={styles.profileRole}>Administrator</span>
                </div>
                <div className={styles.profileAvatar}>AU</div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}

