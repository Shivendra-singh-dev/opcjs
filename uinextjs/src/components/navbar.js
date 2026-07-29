"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./navbar.module.css";

export default function Navbar({ onLoginClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About', href: '/about' },
    { name: 'Ads', href: '/ads' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.navLogo}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoIcon}>🚀</span>
            <span className={styles.logoText}>Ad<span className={styles.logoHighlight}>Creator</span></span>
          </Link>
        </div>

        {/* Hamburger Menu */}
        <button 
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        {/* Navigation Links */}
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          {navItems.map((item) => (
            <li key={item.name} className={styles.navItem}>
              <Link href={item.href} className={styles.navLink}>
                {item.name}
              </Link>
            </li>
          ))}
          <li className={styles.navItem}>
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                if (onLoginClick) onLoginClick();
              }} 
              className={styles.loginBtn}
            >
              Sign In
            </button>
          </li>
          <li className={styles.navItem}>
            <Link href="/signup" className={styles.signupBtn}>
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}