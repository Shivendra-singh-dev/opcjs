import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navLogo}>
            <Image
              src="/next.svg"
              alt="Logo"
              width={120}
              height={30}
              priority
            />
          </div>
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
            <Link href="/about" className={styles.navLink}>About</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
            <Link href="/signup" className={`${styles.navLink} ${styles.signupBtn}`}>
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
