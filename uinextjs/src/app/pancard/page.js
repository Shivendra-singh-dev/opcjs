'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import SocialSidebar from '@/components/SocialSidebar';
import Navbar from '@/components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Page = () => {
    const [panCardNumber, setPanCardNumber] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .slice(0, 10);

        setPanCardNumber(value);
        setMessage('');
    };

    const validatePanCard = (pan) => {
        // PAN format: AAAAA9999A
        const panCardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panCardPattern.test(pan);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validatePanCard(panCardNumber)) {
            setMessage(
                'Invalid PAN card number format. Please enter a valid PAN card number.'
            );
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('/api/pancard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    panCardNumber,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || 'PAN verification failed.'
                );
            }

            console.log('Verification Result:', data);

            setMessage(
                data?.message || 'PAN card verified successfully.'
            );

            setPanCardNumber('');
        } catch (error) {
            console.error('Error verifying PAN card number:', error);

            setMessage(
                error.message || 'Something went wrong while verifying the PAN card.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Component mounted');
    }, []);

    return (
        <>
            <Navbar />
            <SocialSidebar />

            <div className={styles.container}>
                <h1 className={styles.title}>
                    PAN Card Verification
                </h1>

                <p className={styles.description}>
                    Please enter your PAN card number below to verify its authenticity.
                </p>

                {message && (
                    <p id="msg" className={styles.message}>
                        {message}
                    </p>
                )}

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        placeholder="Enter PAN Card Number"
                        className={styles.input}
                        value={panCardNumber}
                        onChange={handleInputChange}
                        maxLength={10}
                        autoComplete="off"
                        required
                    />

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Page;