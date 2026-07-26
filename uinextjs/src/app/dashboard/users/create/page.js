'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import ds from '../../page.module.css';

export default function DashboardCreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("User created successfully! Redirecting...");
        setIsError(false);
        setFormData({
          name: "", email: "", mobile: "",
          password: "", confirmPassword: "",
        });
        setTimeout(() => router.push("/dashboard/users"), 1500);
      } else {
        setMessage(data.error || "Failed to create user");
        setIsError(true);
      }
    } catch (err) {
      setMessage("Unable to connect to server.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, letterSpacing: '-0.03em', color: '#1e293b' }}>
            👤 Create New User
          </h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(15, 23, 42, 0.6)', fontWeight: 600 }}>
            Add a new user to the system.
          </p>
        </div>
      </div>

      {message && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 16px', borderRadius: 16,
          fontWeight: 700, fontSize: '0.85rem', marginBottom: '16px',
          background: isError ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
          border: isError ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)',
          color: isError ? '#dc2626' : '#15803d',
        }}>
          <span>{isError ? "⚠️" : "✅"}</span> {message}
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }} onClick={() => setMessage("")}>✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          padding: 24, borderRadius: 24,
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(99, 102, 241, 0.06)',
          boxShadow: '0 8px 32px rgba(2, 6, 23, 0.04)',
        }}>
          <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#1e293b', marginBottom: 4 }}>
            User Information
          </div>
          <div style={{ color: 'rgba(15, 23, 42, 0.5)', fontWeight: 600, fontSize: '0.8rem', marginBottom: 20 }}>
            Enter the details for the new user account.
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', marginBottom: 6, display: 'block' }}>Full Name</label>
            <div className={ds.datatableSearchWrap}>
              <span style={{ fontSize: '1rem', color: 'rgba(15, 23, 42, 0.3)' }}>👤</span>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="John Doe" required
                className={ds.datatableSearchInput} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', marginBottom: 6, display: 'block' }}>Email Address</label>
            <div className={ds.datatableSearchWrap}>
              <span style={{ fontSize: '1rem', color: 'rgba(15, 23, 42, 0.3)' }}>✉️</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="john@example.com" required
                className={ds.datatableSearchInput} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', marginBottom: 6, display: 'block' }}>Mobile Number</label>
            <div className={ds.datatableSearchWrap}>
              <span style={{ fontSize: '1rem', color: 'rgba(15, 23, 42, 0.3)' }}>📱</span>
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange}
                placeholder="+1 (555) 123-4567" required
                className={ds.datatableSearchInput} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', marginBottom: 6, display: 'block' }}>Password</label>
              <div className={ds.datatableSearchWrap}>
                <span style={{ fontSize: '1rem', color: 'rgba(15, 23, 42, 0.3)' }}>🔒</span>
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password}
                  onChange={handleChange} placeholder="••••••••" required
                  className={ds.datatableSearchInput} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', marginBottom: 6, display: 'block' }}>Confirm Password</label>
              <div className={ds.datatableSearchWrap}>
                <span style={{ fontSize: '1rem', color: 'rgba(15, 23, 42, 0.3)' }}>🔐</span>
                <input type={showPassword ? "text" : "password"} name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  placeholder="••••••••" required
                  className={ds.datatableSearchInput} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
          <button type="button" onClick={() => router.push("/dashboard/users")}
            style={{
              border: '1px solid rgba(15, 23, 42, 0.08)', cursor: 'pointer',
              fontWeight: 800, padding: '10px 24px', borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.7)', color: '#1e293b',
              fontFamily: 'inherit', fontSize: '0.9rem',
            }}>
            Cancel
          </button>
          <button type="submit" disabled={loading}
            style={{
              border: 'none', cursor: 'pointer', fontWeight: 800,
              padding: '10px 28px', borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', fontFamily: 'inherit', fontSize: '0.9rem',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.25)',
              opacity: loading ? 0.6 : 1,
            }}>
            {loading ? "Creating..." : "✨ Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}

