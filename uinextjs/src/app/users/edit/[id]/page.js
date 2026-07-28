'use client'

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./page.module.css";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${id}`);
        const user = await res.json();
        if (!mounted) return;
        if (res.ok && !user.error) {
          setFormData({
            name: user.name || "",
            email: user.email || "",
            mobile: user.mobile || "",
            address: user.address || "",
            city: user.city || "",
            state: user.state || "",
            zip_code: user.zip_code || "",
            country: user.country || "",
          });
        } else {
          setMessage(user.error || "User not found");
          setIsError(true);
        }
      } catch (err) {
        if (mounted) {
          setMessage("Unable to connect to server.");
          setIsError(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setIsError(false);
    try {
      const res = await fetch(`/api/users/${id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          country: formData.country,
          email: formData.email,
          mobile: formData.mobile,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("User updated successfully!");
        setIsError(false);
        setTimeout(() => router.push("/users"), 1000);
      } else {
        setMessage(data.error || data.message || "Failed to update user");
        setIsError(true);
      }
    } catch (err) {
      setMessage("Unable to connect to server.");
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>✏️ Edit User</h1>
          <p className={styles.subtitle}>Update user information and details.</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={isError ? styles.errorMessage : styles.successMessage}>
          <span>{isError ? "⚠️" : "✅"}</span> {message}
          <button className={styles.messageClose} onClick={() => setMessage("")}>✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>User Information</div>
          <div className={styles.cardSub}>Edit the details for this user account.</div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="name">Full Name</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>👤</span>
              <input type="text" id="name" name="name" className={styles.input} value={formData.name} onChange={handleChange} placeholder="John Doe" required />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">Email Address <span className={styles.immutableBadge}>🔒</span></label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>✉️</span>
              <input type="email" id="email" name="email" className={`${styles.input} ${styles.inputReadonly}`} value={formData.email} readOnly tabIndex={-1} />
            </div>
            <span className={styles.fieldHint}>Email cannot be changed.</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="mobile">Mobile Number <span className={styles.immutableBadge}>🔒</span></label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>📱</span>
              <input type="tel" id="mobile" name="mobile" className={`${styles.input} ${styles.inputReadonly}`} value={formData.mobile} readOnly tabIndex={-1} />
            </div>
            <span className={styles.fieldHint}>Mobile number cannot be changed.</span>
          </div>

          <div className={styles.separator} />

          <div className={styles.cardTitle}>Address</div>
          <div className={styles.cardSub}>User location details (optional)</div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="address">Street Address</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>📍</span>
              <textarea id="address" name="address" className={styles.textarea} value={formData.address} onChange={handleChange} placeholder="Enter street address" rows={2} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="city">City</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🏙️</span>
                <input type="text" id="city" name="city" className={styles.input} value={formData.city} onChange={handleChange} placeholder="City" />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="state">State</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🗺️</span>
                <input type="text" id="state" name="state" className={styles.input} value={formData.state} onChange={handleChange} placeholder="State" />
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="zip_code">Zip Code</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>📮</span>
                <input type="text" id="zip_code" name="zip_code" className={styles.input} value={formData.zip_code} onChange={handleChange} placeholder="Zip/Postal code" />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="country">Country</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🌍</span>
                <input type="text" id="country" name="country" className={styles.input} value={formData.country} onChange={handleChange} placeholder="Country" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={() => router.push("/users")}>Cancel</button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? (
              <><span className={styles.btnSpinner} /> Saving...</>
            ) : (
              <>💾 Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

