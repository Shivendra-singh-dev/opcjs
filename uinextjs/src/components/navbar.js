"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./navbar.module.css";

export default function Navbar({ onLoginClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const serviceItems = [
    { name: 'Owner-Chat', href: '/owner-chat' },
    { name: 'Ad-Create', href: '/ads' },
    { name: '📚SmartLib', href: '/smartlib' },
    { name: 'e-Learning', href: '/el' },
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
          
          {/* Services Dropdown */}
          <li 
            className={styles.navItem}
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <span className={styles.navLink}>
              Services <span className={styles.dropdownArrow}>▼</span>
            </span>
            {isServicesOpen && (
              <ul className={styles.dropdownMenu}>
                {serviceItems.map((service) => (
                  <li key={service.name} className={styles.dropdownItem}>
                    <Link href={service.href} className={styles.dropdownLink}>
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

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