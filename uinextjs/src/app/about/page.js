import Link from "next/link";
import styles from "./page.module.css";
import Navbar from "../../components/navbar.js";

export default function About() {
  return (
    <div className={styles.page}>
      <Navbar/>
      {/* About Content */}
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>About Us</span>
            <h1 className={styles.heroTitle}>
              We re Building the<br />
              <span className={styles.highlight}>Future of Web</span>
            </h1>
            <p className={styles.heroDescription}>
              Passionate about creating exceptional digital experiences 
              that combine beautiful design with cutting-edge technology.
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>5+</span>
              <span className={styles.statLabel}>Years Experience</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100+</span>
              <span className={styles.statLabel}>Projects Delivered</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Happy Clients</span>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.mission}>
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>🎯</div>
              <h3>Our Mission</h3>
              <p>
                To empower businesses and individuals with innovative 
                digital solutions that drive growth and create meaningful 
                connections.
              </p>
            </div>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>👁️</div>
              <h3>Our Vision</h3>
              <p>
                To be the leading force in transforming how people interact 
                with technology, making the digital world more accessible 
                and beautiful.
              </p>
            </div>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>💡</div>
              <h3>Our Values</h3>
              <p>
                Innovation, integrity, and excellence guide everything we do. 
                We believe in creating technology that makes a positive impact.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.team}>
          <h2 className={styles.sectionTitle}>Meet Our Team</h2>
          <div className={styles.teamGrid}>
            <div className={styles.teamCard}>
              <div className={styles.teamAvatar}>👩‍💻</div>
              <h4>Sarah Johnson</h4>
              <p>CEO & Founder</p>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>🐦</a>
                <a href="#" className={styles.socialLink}>🔗</a>
              </div>
            </div>
            <div className={styles.teamCard}>
              <div className={styles.teamAvatar}>👨‍💻</div>
              <h4>Michael Chen</h4>
              <p>Lead Developer</p>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>🐦</a>
                <a href="#" className={styles.socialLink}>🔗</a>
              </div>
            </div>
            <div className={styles.teamCard}>
              <div className={styles.teamAvatar}>🎨</div>
              <h4>Emily Rodriguez</h4>
              <p>UX Designer</p>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>🐦</a>
                <a href="#" className={styles.socialLink}>🔗</a>
              </div>
            </div>
            <div className={styles.teamCard}>
              <div className={styles.teamAvatar}>📊</div>
              <h4>David Kim</h4>
              <p>Product Manager</p>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>🐦</a>
                <a href="#" className={styles.socialLink}>🔗</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}