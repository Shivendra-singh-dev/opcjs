"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./SocialSidebar.module.css";

const SocialSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sidebarRef = useRef(null);
  const triggerRef = useRef(null);

  // Detect mouse movement near left edge
  useEffect(() => {
    const handleMouseMove = (e) => {
      // If mouse is within 100px of left edge
      if (e.clientX < 100 && !isOpen) {
        setIsVisible(true);
      } else if (e.clientX > 100 && !isOpen) {
        setIsVisible(false);
      }
    };

    const handleMouseLeave = () => {
      if (!isOpen) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsVisible(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsVisible(true);
    }
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: "📘",
      url: "https://facebook.com",
      color: "#1877f2",
      hoverColor: "#145dbf",
    },
    {
      name: "Instagram",
      icon: "📸",
      url: "https://instagram.com",
      color: "#e4405f",
      hoverColor: "#c13584",
    },
    {
      name: "YouTube",
      icon: "▶️",
      url: "https://youtube.com",
      color: "#ff0000",
      hoverColor: "#cc0000",
    },
    {
      name: "Twitter",
      icon: "🐦",
      url: "https://twitter.com",
      color: "#1da1f2",
      hoverColor: "#0d8bd9",
    },
    {
      name: "LinkedIn",
      icon: "🔗",
      url: "https://linkedin.com",
      color: "#0a66c2",
      hoverColor: "#004182",
    },
    {
      name: "GitHub",
      icon: "💻",
      url: "https://github.com",
      color: "#333",
      hoverColor: "#000",
    },
    {
      name: "Pinterest",
      icon: "📌",
      url: "https://pinterest.com",
      color: "#e60023",
      hoverColor: "#bd081c",
    },
    {
      name: "TikTok",
      icon: "🎵",
      url: "https://tiktok.com",
      color: "#000",
      hoverColor: "#fe2c55",
    },
  ];

  return (
    <>
      {/* Trigger area - invisible but detects mouse */}
      <div 
        className={`${styles.triggerArea} ${isVisible ? styles.active : ''}`}
        ref={triggerRef}
        onClick={toggleSidebar}
      >
        <div className={styles.triggerIndicator}>
          <span>◀</span>
        </div>
      </div>

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`${styles.sidebar} ${isOpen ? styles.open : ''} ${isVisible ? styles.visible : ''}`}
        onMouseLeave={() => {
          if (!isOpen) {
            setIsVisible(false);
          }
        }}
      >
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarTitle}>Connect With Us</h3>
          <button 
            className={styles.closeBtn}
            onClick={() => {
              setIsOpen(false);
              setIsVisible(false);
            }}
          >
            ✕
          </button>
        </div>

        <div className={styles.socialList}>
          {socialLinks.map((social, index) => (
            <Link
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialItem}
              style={{ 
                animationDelay: `${index * 0.05}s`,
                '--social-color': social.color,
                '--social-hover': social.hoverColor
              }}
            >
              <span className={styles.socialIcon}>{social.icon}</span>
              <span className={styles.socialName}>{social.name}</span>
              <span className={styles.socialArrow}>→</span>
            </Link>
          ))}
        </div>

        <div className={styles.sidebarFooter}>
          <p className={styles.footerText}>Follow us for updates</p>
          <div className={styles.footerDecoration}>
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={() => {
            setIsOpen(false);
            setIsVisible(false);
          }}
        />
      )}
    </>
  );
};

export default SocialSidebar;