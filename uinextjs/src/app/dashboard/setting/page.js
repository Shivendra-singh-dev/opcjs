'use client'

import { useState } from "react";
import styles from "./page.module.css";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, letterSpacing: '-0.03em', color: '#1e293b' }}>
          ⚙️ Settings
        </h1>
        <p style={{ margin: '6px 0 0', color: 'rgba(15, 23, 42, 0.6)', fontWeight: 600 }}>
          Manage your application preferences and configurations.
        </p>
      </div>

      {saved && (
        <div style={{
          padding: '12px 16px', borderRadius: 16,
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          color: '#15803d', fontWeight: 700, fontSize: '0.85rem',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <span>✅</span> Settings saved successfully!
        </div>
      )}

      <div style={{
        padding: 20, borderRadius: 24,
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(99, 102, 241, 0.06)',
        boxShadow: '0 8px 32px rgba(2, 6, 23, 0.04)',
      }}>
        <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#1e293b', marginBottom: 4 }}>
          Notifications
        </div>
        <div style={{ color: 'rgba(15, 23, 42, 0.5)', fontWeight: 600, fontSize: '0.8rem', marginBottom: 20 }}>
          Configure how you receive updates and alerts
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Email Notifications', desc: 'Receive updates via email', value: emailNotifications, setter: setEmailNotifications },
            { label: 'Push Notifications', desc: 'Receive push notifications in browser', value: pushNotifications, setter: setPushNotifications },
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid rgba(15, 23, 42, 0.04)',
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{item.label}</div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'rgba(15, 23, 42, 0.5)', marginTop: 2 }}>{item.desc}</div>
              </div>
              <label style={{
                position: 'relative', display: 'inline-block', width: 48, height: 26, cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={item.value}
                  onChange={() => item.setter(!item.value)}
                  style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: 26,
                  background: item.value ? '#6366f1' : 'rgba(15, 23, 42, 0.1)',
                  transition: 'all 0.3s ease',
                }}>
                  <span style={{
                    position: 'absolute', top: 3, left: item.value ? 25 : 3,
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'white', transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }} />
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: 20, borderRadius: 24,
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(99, 102, 241, 0.06)',
        boxShadow: '0 8px 32px rgba(2, 6, 23, 0.04)',
      }}>
        <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#1e293b', marginBottom: 4 }}>
          Preferences
        </div>
        <div style={{ color: 'rgba(15, 23, 42, 0.5)', fontWeight: 600, fontSize: '0.8rem', marginBottom: 20 }}>
          Customize your experience
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Dark Mode', desc: 'Use dark theme across the dashboard', value: darkMode, setter: setDarkMode },
            { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', value: twoFactor, setter: setTwoFactor },
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid rgba(15, 23, 42, 0.04)',
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{item.label}</div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'rgba(15, 23, 42, 0.5)', marginTop: 2 }}>{item.desc}</div>
              </div>
              <label style={{
                position: 'relative', display: 'inline-block', width: 48, height: 26, cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={item.value}
                  onChange={() => item.setter(!item.value)}
                  style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: 26,
                  background: item.value ? '#6366f1' : 'rgba(15, 23, 42, 0.1)',
                  transition: 'all 0.3s ease',
                }}>
                  <span style={{
                    position: 'absolute', top: 3, left: item.value ? 25 : 3,
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'white', transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }} />
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            border: 'none', cursor: 'pointer', fontWeight: 800,
            padding: '10px 28px', borderRadius: 14,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', fontSize: '0.9rem',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.25)',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving...' : '💾 Save Settings'}
        </button>
      </div>
    </div>
  );
}

