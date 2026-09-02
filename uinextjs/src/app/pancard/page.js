'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import SocialSidebar from '@/components/SocialSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "@/components/navbar";


const page = async () => {
    try {
        console.log('hi shiva test nodejs project')
    } catch (error) {
        console.error("Error in pancard page:", error);
    }

    return (
        <>
            <Navbar />
            <SocialSidebar />
            <div className={styles.container}>
                <h1 className={styles.title}>PAN Card Verification</h1>
                <p className={styles.description}>  
                    Please enter your PAN card number below to verify its authenticity. 
                </p>
                <form className={styles.form}>
                    <input 
                        type="text" 
                        placeholder="Enter PAN Card Number" 
                        className={styles.input} 
                    />
                    <button type="submit" className={styles.button}>Verify</button>
                </form>
            </div>
        </>
    )
}


export default page;