'use client'

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/contacts', label: 'Contacts', icon: '📞' },
    { href: '/dashboard/users', label: 'Users', icon: '👤' },
    { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
    { href: '/dashboard/setting', label: 'Settings', icon: '⚙️' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    router.push('/');
  };

  const handleProfileClick = () => {
    setProfileOpen(!profileOpen);
  };

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
                {pathname === '/dashboard' ? 'Dashboard' 
                  : pathname.includes('/contacts') ? 'Contacts' 
                  : pathname.includes('/users') ? 'Users'
                  : pathname.includes('/profile') ? 'Profile'
                  : pathname.includes('/setting') ? 'Settings'
                  : 'Dashboard'}
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

              {/* Profile Dropdown */}
              <div className={styles.profileDropdown} ref={dropdownRef}>
                <button
                  className={`${styles.profileChip} ${profileOpen ? styles.profileChipActive : ''}`}
                  onClick={handleProfileClick}
                  aria-label="Profile menu"
                  aria-expanded={profileOpen}
                >
                  <span className={styles.notificationDot} />
                  <div className={styles.profileText}>
                    <span className={styles.profileName}>Admin User</span>
                    <span className={styles.profileRole}>Administrator</span>
                  </div>
                  <div className={styles.profileAvatar}>AU</div>
                  <span className={`${styles.dropdownArrow} ${profileOpen ? styles.dropdownArrowOpen : ''}`}>
                    ▼
                  </span>
                </button>

                {profileOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatar}>AU</div>
                      <div className={styles.dropdownUserInfo}>
                        <span className={styles.dropdownName}>Admin User</span>
                        <span className={styles.dropdownEmail}>admin@platform.com</span>
                      </div>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <button className={styles.dropdownItem} onClick={() => { setProfileOpen(false); router.push('/dashboard/profile'); }}>
                      <span className={styles.dropdownIcon}>👤</span>
                      <span>My Profile</span>
                    </button>
                    <button className={styles.dropdownItem} onClick={() => { setProfileOpen(false); router.push('/dashboard/setting'); }}>
                      <span className={styles.dropdownIcon}>⚙️</span>
                      <span>Settings</span>
                    </button>
                    <div className={styles.dropdownDivider} />
                    <button className={styles.dropdownItem} onClick={handleLogout}>
                      <span className={styles.dropdownIcon}>🚪</span>
                      <span>Logout</span>
                      <span className={styles.dropdownHint}>→ Home</span>
                    </button>
                  </div>
                )}
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

