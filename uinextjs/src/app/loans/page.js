'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import SocialSidebar from '@/components/SocialSidebar';
import Navbar from '@/components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoansPage = () => {
    const [loanAmount, setLoanAmount] = useState('');
    const [loanPurpose, setLoanPurpose] = useState('');
    const [loanTerm, setLoanTerm] = useState('');
    const [applicantName, setApplicantName] = useState('');
    const [submittedData, setSubmittedData] = useState(null);

    // Practice/demo data
    const practiceData = {
        applicantName: 'Rahul Sharma',
        loanAmount: '500000',
        loanPurpose: 'Home Improvement',
        loanTerm: '5',
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const amount = urlParams.get('loanAmount');

        if (amount) {
            setLoanAmount(amount);
        } else {
            // Load practice data if no URL parameter is provided
            setApplicantName(practiceData.applicantName);
            setLoanAmount(practiceData.loanAmount);
            setLoanPurpose(practiceData.loanPurpose);
            setLoanTerm(practiceData.loanTerm);
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            applicantName,
            loanAmount,
            loanPurpose,
            loanTerm,
        };

        console.log('Practice Loan Data:', data);
        setSubmittedData(data);
    };

    return (
        <>
            <Navbar />
            <SocialSidebar />

            <div className={styles.container}>
                <h1 className={styles.title}>
                    Loan Application
                    {loanAmount && ` for ₹${loanAmount}`}
                </h1>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        Applicant Name:
                        <input
                            type="text"
                            value={applicantName}
                            onChange={(event) =>
                                setApplicantName(event.target.value)
                            }
                            className={styles.input}
                            placeholder="Enter your name"
                        />
                    </label>

                    <label className={styles.label}>
                        Loan Amount:
                        <input
                            type="number"
                            value={loanAmount}
                            onChange={(event) =>
                                setLoanAmount(event.target.value)
                            }
                            className={styles.input}
                            placeholder="Enter loan amount"
                        />
                    </label>

                    <label className={styles.label}>
                        Loan Purpose:
                        <input
                            type="text"
                            value={loanPurpose}
                            onChange={(event) =>
                                setLoanPurpose(event.target.value)
                            }
                            className={styles.input}
                            placeholder="e.g. Home Improvement"
                        />
                    </label>

                    <label className={styles.label}>
                        Loan Term:
                        <select
                            value={loanTerm}
                            onChange={(event) =>
                                setLoanTerm(event.target.value)
                            }
                            className={styles.input}
                        >
                            <option value="">Select term</option>
                            <option value="1">1 Year</option>
                            <option value="3">3 Years</option>
                            <option value="5">5 Years</option>
                            <option value="10">10 Years</option>
                            <option value="15">15 Years</option>
                        </select>
                    </label>

                    <button
                        type="submit"
                        className={styles.button}
                    >
                        Submit Application
                    </button>
                </form>

                {submittedData && (
                    <div className={styles.result}>
                        <h2>Practice Submission</h2>

                        <p>
                            <strong>Name:</strong>{' '}
                            {submittedData.applicantName}
                        </p>

                        <p>
                            <strong>Loan Amount:</strong> ₹
                            {submittedData.loanAmount}
                        </p>

                        <p>
                            <strong>Purpose:</strong>{' '}
                            {submittedData.loanPurpose}
                        </p>

                        <p>
                            <strong>Term:</strong>{' '}
                            {submittedData.loanTerm} Years
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default LoansPage;
