"use client";

import React, { useState } from 'react';
import styles from './AdCreationModal.module.css';

export default function AdCreationModal({ 
  isOpen, 
  onClose, 
  onCreateAd,
  selectedPlatform,
  platforms 
}) {
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    platform: selectedPlatform?.name || '',
    image: '',
    link: '',
    targetAudience: '',
    budget: '',
    schedule: '',
  });

  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateAd(adData);
    setAdData({
      title: '',
      description: '',
      platform: '',
      image: '',
      link: '',
      targetAudience: '',
      budget: '',
      schedule: '',
    });
    setCurrentStep(1);
  };

  const handleClose = () => {
    onClose();
    setCurrentStep(1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const steps = ['Platform & Content', 'Design & Media', 'Targeting & Schedule'];

  const getPlatformSizes = (platform) => {
    const sizes = {
      'WhatsApp': '1200 x 628px',
      'Facebook': '1200 x 628px',
      'Instagram': '1080 x 1080px',
      'Telegram': '1280 x 720px',
      'X / Twitter': '1200 x 675px',
      'LinkedIn': '1200 x 627px',
    };
    return sizes[platform] || '1200 x 628px';
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <span className={styles.gradientText}>Create New</span> Ad
          </h2>
          <button className={styles.closeButton} onClick={handleClose}>✕</button>
        </div>

        {/* Progress Steps */}
        <div className={styles.progressSteps}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepIndicator}>
              <div className={`${styles.stepCircle} ${currentStep > index ? styles.completed : ''} ${currentStep === index + 1 ? styles.active : ''}`}>
                {currentStep > index ? '✓' : index + 1}
              </div>
              <span className={styles.stepLabel}>{step}</span>
              {index < steps.length - 1 && <div className={styles.stepLine}></div>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* Step 1: Platform & Content */}
          {currentStep === 1 && (
            <div className={styles.formStep}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Platform</label>
                <select
                  name="platform"
                  value={adData.platform}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                  required
                >
                  <option value="">Select Platform</option>
                  {platforms.map((platform) => (
                    <option key={platform.name} value={platform.name}>
                      {platform.icon} {platform.name}
                    </option>
                  ))}
                </select>
                {adData.platform && (
                  <p className={styles.platformSize}>
                    Recommended size: {getPlatformSizes(adData.platform)}
                  </p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ad Title</label>
                <input
                  type="text"
                  name="title"
                  value={adData.title}
                  onChange={handleInputChange}
                  placeholder="Enter ad title"
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  name="description"
                  value={adData.description}
                  onChange={handleInputChange}
                  placeholder="Enter ad description"
                  className={styles.formTextarea}
                  rows={4}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target Link</label>
                <input
                  type="url"
                  name="link"
                  value={adData.link}
                  onChange={handleInputChange}
                  placeholder="https://your-link.com"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.nextButton}
                  onClick={() => setCurrentStep(2)}
                >
                  Next: Design & Media →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Design & Media */}
          {currentStep === 2 && (
            <div className={styles.formStep}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Upload Image</label>
                <div className={styles.imageUploadArea}>
                  {adData.image ? (
                    <div className={styles.imagePreview}>
                      <img src={adData.image} alt="Ad preview" />
                      <button 
                        type="button" 
                        className={styles.removeImage}
                        onClick={() => setAdData(prev => ({ ...prev, image: '' }))}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <span className={styles.uploadIcon}>📤</span>
                      <p>Click or drag to upload</p>
                      <p className={styles.uploadHint}>PNG, JPG up to 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.imageInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>AI Enhancements</label>
                <div className={styles.aiOptions}>
                  <label className={styles.aiOption}>
                    <input type="checkbox" />
                    Auto-enhance image quality
                  </label>
                  <label className={styles.aiOption}>
                    <input type="checkbox" />
                    Add AI-generated tagline
                  </label>
                  <label className={styles.aiOption}>
                    <input type="checkbox" />
                    Optimize for engagement
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.backButton}
                  onClick={() => setCurrentStep(1)}
                >
                  ← Back
                </button>
                <button 
                  type="button" 
                  className={styles.nextButton}
                  onClick={() => setCurrentStep(3)}
                >
                  Next: Targeting →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Targeting & Schedule */}
          {currentStep === 3 && (
            <div className={styles.formStep}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target Audience</label>
                <input
                  type="text"
                  name="targetAudience"
                  value={adData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="e.g., 18-35, Tech enthusiasts"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Budget (USD)</label>
                <input
                  type="number"
                  name="budget"
                  value={adData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter budget"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Schedule</label>
                <select
                  name="schedule"
                  value={adData.schedule}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                >
                  <option value="">Select schedule</option>
                  <option value="immediate">Immediate</option>
                  <option value="scheduled">Schedule for later</option>
                  <option value="recurring">Recurring</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ad Preview</label>
                <div className={styles.adPreview}>
                  <div className={styles.previewCard}>
                    <div className={styles.previewPlatform}>
                      {adData.platform || 'Platform not selected'}
                    </div>
                    {adData.image && (
                      <img src={adData.image} alt="Preview" className={styles.previewImage} />
                    )}
                    <h4 className={styles.previewTitle}>{adData.title || 'Ad Title'}</h4>
                    <p className={styles.previewDescription}>{adData.description || 'Ad description goes here'}</p>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.backButton}
                  onClick={() => setCurrentStep(2)}
                >
                  ← Back
                </button>
                <button type="submit" className={styles.submitButton}>
                  🚀 Create Ad
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}