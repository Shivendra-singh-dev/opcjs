'use client'

import { useState } from 'react'
import styles from './page.module.css'
import Navbar from '../../components/navbar'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = e => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    // Clear field error when user types
    if (fieldErrors[id]) {
      setFieldErrors(prev => {
        const updated = { ...prev }
        delete updated[id]
        return updated
      })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setResponseMessage('')
    setIsError(false)
    setFieldErrors({})
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (res.ok) {
        setResponseMessage('Message sent successfully!')
        setIsError(false)
        setFormData({ name: '', email: '', mobile: '', message: '' })
        setFieldErrors({})
      } else {
        setResponseMessage(data.message || 'Something went wrong.')
        setIsError(true)
        // Set field-level errors if backend returned them
        if (data.errors) {
          setFieldErrors(data.errors)
        }
      }
    } catch (error) {
      setResponseMessage('Unable to connect to the server.')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.contactContainer}>
          <div className={styles.contactInfo}>
            <span className={styles.badge}>Get in Touch</span>
            <h1 className={styles.contactTitle}>Let&apos;s Start a <br /><span className={styles.highlight}>Conversation</span></h1>
            <p className={styles.contactDescription}>Have a project in mind or want to learn more about our services? We&apos;d love to hear from you.</p>
            <div className={styles.infoItems}>
              <div className={styles.infoItem}><span className={styles.infoIcon}></span><div><h4>Email</h4><p>hello@example.com</p></div></div>
              <div className={styles.infoItem}><span className={styles.infoIcon}></span><div><h4>Mobile</h4><p>+1 (555) 123-4567</p></div></div>
              <div className={styles.infoItem}><span className={styles.infoIcon}></span><div><h4>Location</h4><p>San Francisco, CA</p></div></div>
            </div>
          </div>
          <div className={styles.contactForm}>
            <div className={styles.formCard}>
              <h2>Send a Message</h2>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}><label htmlFor="name">Full Name</label><input id="name" type="text" value={formData.name} onChange={handleChange} placeholder="John Doe" className={`${styles.formInput}${fieldErrors.name ? ' ' + styles.formInputError : ''}`} required /></div>
                <div className={styles.formGroup}><label htmlFor="email">Email Address</label><input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className={`${styles.formInput}${fieldErrors.email ? ' ' + styles.formInputError : ''}`} required />
                  {fieldErrors.email && <span className={styles.errorText}>{fieldErrors.email}</span>}</div>
                <div className={styles.formGroup}><label htmlFor="mobile">Mobile Number</label><input id="mobile" type="tel" value={formData.mobile} onChange={handleChange} placeholder="Enter your mobile number" className={`${styles.formInput}${fieldErrors.mobile ? ' ' + styles.formInputError : ''}`} required />
                  {fieldErrors.mobile && <span className={styles.errorText}>{fieldErrors.mobile}</span>}</div>
                <div className={styles.formGroup}><label htmlFor="message">Message</label><textarea id="message" rows={5} value={formData.message} onChange={handleChange} placeholder="Tell us about your project..." className={styles.formTextarea} required /></div>
                {responseMessage && (
                  <p className={isError ? styles.errorMessage : styles.successMessage}>{responseMessage}</p>
                )}
                <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? 'Sending...' : 'Send Message'}
                  <svg className={styles.btnIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

