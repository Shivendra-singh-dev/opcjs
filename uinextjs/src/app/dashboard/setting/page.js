'use client'

import { useState, useEffect } from "react";
import styles from "./page.module.css";

function ToggleSwitch({ value, onChange }) {
  return (
    <label className={styles.toggleSwitch}>
      <input
        type="checkbox"
        checked={value}
        onChange={onChange}
        className={styles.toggleInput}
      />
      <span className={`${styles.toggleTrack} ${value ? styles.toggleTrackActive : ''}`}>
        <span className={`${styles.toggleThumb} ${value ? styles.toggleThumbActive : ''}`} />
      </span>
    </label>
  );
}

export default function SettingsPage() {
  // Use useEffect to read localStorage (SSR-safe)
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // General settings save
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load user and persisted settings from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('loggedInUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setLoggedInUser(parsed);
        }
      }

      // Load persisted toggle states
      const savedSettings = localStorage.getItem('dashboardSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.emailNotifications !== undefined) setEmailNotifications(parsed.emailNotifications);
        if (parsed.pushNotifications !== undefined) setPushNotifications(parsed.pushNotifications);
        if (parsed.darkMode !== undefined) setDarkMode(parsed.darkMode);
        if (parsed.twoFactor !== undefined) setTwoFactor(parsed.twoFactor);
      }
    } catch (e) {
      // ignore
    } finally {
      setUserLoading(false);
    }
  }, []);

  const handleSaveSettings = () => {
    setSaving(true);
    // Persist toggle states to localStorage
    try {
      const settings = { emailNotifications, pushNotifications, darkMode, twoFactor };
      localStorage.setItem('dashboardSettings', JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (!loggedInUser?.id) {
      setPasswordError("You must be logged in to change password");
      return;
    }

    try {
      setPasswordSaving(true);
      const res = await fetch(`/api/users/${loggedInUser.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
      } else {
        setPasswordError(data.error || "Failed to change password");
      }
    } catch (err) {
      setPasswordError("Unable to connect to server.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const userName = loggedInUser?.name || "User";
  const userEmail = loggedInUser?.email || "";

  // Loading state
  if (userLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!loggedInUser) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>⚙️ Settings</h1>
            <p className={styles.subtitle}>Manage your application preferences and configurations.</p>
          </div>
        </div>
        <div className={styles.messageError}>
          <span>⚠️</span> You must be logged in to access settings. Please sign in from the homepage.
        </div>
      </div>
    );
  }

  const toggleItems = [
    { label: 'Email Notifications', desc: 'Receive updates via email', value: emailNotifications, setter: setEmailNotifications },
    { label: 'Push Notifications', desc: 'Receive push notifications in browser', value: pushNotifications, setter: setPushNotifications },
    { label: 'Dark Mode', desc: 'Use dark theme across the dashboard', value: darkMode, setter: setDarkMode },
    { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', value: twoFactor, setter: setTwoFactor },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>⚙️ Settings</h1>
          <p className={styles.subtitle}>Manage your application preferences and configurations.</p>
        </div>
      </div>

      {/* Logged in user badge */}
      {userEmail && (
        <div className={styles.userBadge}>
          <span>👤</span> Logged in as <strong>{userName}</strong> ({userEmail})
        </div>
      )}

      {/* Success message */}
      {saved && (
        <div className={styles.messageSuccess}>
          <span>✅</span> Settings saved successfully!
          <button className={styles.messageClose} onClick={() => setSaved(false)}>✕</button>
        </div>
      )}

      {/* Notifications & Preferences Cards */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>Notifications</div>
        <div className={styles.cardSub}>Configure how you receive updates and alerts</div>
        <div className={styles.toggleList}>
          {toggleItems.slice(0, 2).map((item) => (
            <div key={item.label} className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>{item.label}</div>
                <div className={styles.toggleDesc}>{item.desc}</div>
              </div>
              <ToggleSwitch value={item.value} onChange={() => item.setter(!item.value)} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Preferences</div>
        <div className={styles.cardSub}>Customize your experience</div>
        <div className={styles.toggleList}>
          {toggleItems.slice(2).map((item) => (
            <div key={item.label} className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>{item.label}</div>
                <div className={styles.toggleDesc}>{item.desc}</div>
              </div>
              <ToggleSwitch value={item.value} onChange={() => item.setter(!item.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* Security Card - Password Change */}
      <div className={styles.card}>
        <div className={styles.securityHeader}>
          <div>
            <div className={styles.cardTitle}>🔒 Security</div>
            <div className={styles.cardSub}>Manage your account security</div>
          </div>
          <button
            type="button"
            className={`${styles.securityToggleBtn} ${showPasswordForm ? styles.securityToggleBtnActive : ''}`}
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            {showPasswordForm ? '✕ Cancel' : '🔑 Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
            {passwordError && (
              <div className={styles.messageError}>
                ⚠️ {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className={styles.messageSuccess}>
                ✅ {passwordSuccess}
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Current Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>New Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Confirm New Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className={styles.input}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className={styles.saveBtn}
              style={{ alignSelf: 'flex-start' }}
            >
              {passwordSaving ? 'Updating...' : '🔄 Update Password'}
            </button>
          </form>
        )}
      </div>

      {/* Save Button */}
      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className={styles.saveBtn}
        >
          {saving ? 'Saving...' : '💾 Save Settings'}
        </button>
      </div>
    </div>
  );
}
