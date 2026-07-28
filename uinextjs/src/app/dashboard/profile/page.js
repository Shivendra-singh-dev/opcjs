'use client'

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function ProfilePage() {
  const router = useRouter();

  // User data state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
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

  // Image state
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Current user ID (hardcoded to 1 for now - in production would come from auth)
  // We'll use the first user from the list since there's no auth session
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch current user from localStorage
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);

        // Get the logged-in user from localStorage
        let userId = null;
        try {
          const stored = localStorage.getItem('loggedInUser');
          if (stored) {
            const parsed = JSON.parse(stored);
            userId = parsed.id;
          }
        } catch (e) {
          // ignore
        }

        if (!userId) {
          // Fallback: get users list and pick the first one
          const res = await fetch("/api/users");
          const users = await res.json();
          if (Array.isArray(users) && users.length > 0) {
            userId = users[0].id;
          } else {
            setError("No users found. Please sign up first.");
            setLoading(false);
            return;
          }
        }

        setCurrentUserId(userId);

        // Now fetch full profile
        const profileRes = await fetch(`/api/users/${userId}`);
        const profileData = await profileRes.json();

        if (!profileRes.ok) {
          setError(profileData.error || "Failed to load profile");
        } else {
          setUser(profileData);
          setFormData({
            name: profileData.name || "",
            email: profileData.email || "",
            mobile: profileData.mobile || "",
            address: profileData.address || "",
            city: profileData.city || "",
            state: profileData.state || "",
            zip_code: profileData.zip_code || "",
            country: profileData.country || "",
          });
          if (profileData.profile_picture) {
            setImagePreview(profileData.profile_picture);
          }
        }
      } catch (err) {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setError("");
  };

  // Upload profile image
  const handleImageUpload = async () => {
    if (!profileImage || !currentUserId) return;

    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("profile_picture", profileImage);

      const res = await fetch(`/api/users/${currentUserId}/profile/image`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Profile picture updated successfully");
        setProfileImage(null);
      } else {
        setError(data.error || "Failed to upload image");
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await fetch(`/api/users/${currentUserId}/profile`, {
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
        setSuccess("Profile updated successfully");
        setUser(data.user);
      } else {
        setError(data.error || data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Profile</h1>
          <p className={styles.subtitle}>Manage your personal information and preferences</p>
        </div>
      </div>

      {/* Error / Success Messages */}
      {error && (
        <div className={styles.messageError}>
          <span>⚠️</span> {error}
          <button className={styles.messageClose} onClick={() => setError("")}>✕</button>
        </div>
      )}
      {success && (
        <div className={styles.messageSuccess}>
          <span>✅</span> {success}
          <button className={styles.messageClose} onClick={() => setSuccess("")}>✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          {/* Profile Image Section */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Profile Picture</div>
            <div className={styles.cardSub}>Upload a photo to personalize your account</div>
            
            <div className={styles.imageSection}>
              <div className={styles.imageWrapper}>
                {imagePreview && !imageError ? (
                  <img
                    src={imagePreview.startsWith("data:") ? imagePreview : imagePreview}
                    alt="Profile"
                    className={styles.profileImage}
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                <div className={styles.imageOverlay}>
                  <button
                    type="button"
                    className={styles.changePhotoBtn}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📷 Change Photo
                  </button>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className={styles.fileInput}
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageSelect}
              />
              {profileImage && (
                <div className={styles.imageActions}>
                  <span className={styles.fileName}>{profileImage.name}</span>
                  <button
                    type="button"
                    className={styles.uploadBtn}
                    onClick={handleImageUpload}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
              )}
              <div className={styles.imageHint}>
                Accepted formats: JPEG, PNG, GIF, WebP. Max size: 5MB.
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Personal Information</div>
            <div className={styles.cardSub}>Your basic contact details</div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="name">Full Name</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={styles.input}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">
                Email Address
                <span className={styles.immutableBadge}>🔒 Primary</span>
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>✉️</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`${styles.input} ${styles.inputReadonly}`}
                  value={formData.email}
                  readOnly
                  tabIndex={-1}
                />
              </div>
              <span className={styles.fieldHint}>Primary email cannot be changed. Contact support for changes.</span>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="mobile">
                Mobile Number
                <span className={styles.immutableBadge}>🔒 Primary</span>
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>📱</span>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  className={`${styles.input} ${styles.inputReadonly}`}
                  value={formData.mobile}
                  readOnly
                  tabIndex={-1}
                />
              </div>
              <span className={styles.fieldHint}>Primary mobile cannot be changed. Contact support for changes.</span>
            </div>
          </div>

          {/* Address Section */}
          <div className={styles.cardFull}>
            <div className={styles.cardTitle}>Address</div>
            <div className={styles.cardSub}>Your location details</div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="address">Street Address</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>📍</span>
                <textarea
                  id="address"
                  name="address"
                  className={styles.textarea}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                  rows={2}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="city">City</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🏙️</span>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className={styles.input}
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="state">State</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🗺️</span>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className={styles.input}
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="zip_code">Zip Code</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>📮</span>
                  <input
                    type="text"
                    id="zip_code"
                    name="zip_code"
                    className={styles.input}
                    value={formData.zip_code}
                    onChange={handleChange}
                    placeholder="Zip/Postal code"
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="country">Country</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🌍</span>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    className={styles.input}
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={saving || !currentUserId}
          >
            {saving ? (
              <>
                <span className={styles.btnSpinner} />
                Saving...
              </>
            ) : (
              <>
                💾 Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

