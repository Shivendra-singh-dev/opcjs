// app/owner-chat/page.js
"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import Navbar from '@/components/navbar';
import SocialSidebar from '@/components/SocialSidebar';
import LoginModal from '@/components/LoginModal';
import { Html5Qrcode } from 'html5-qrcode';
import QRCode from 'react-qr-code';

export default function OwnerChatPage() {
  // Login Modal State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // User States
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [userRole, setUserRole] = useState('user'); // 'user' or 'owner'
  
  // QR Scanner States
  const [isScanning, setIsScanning] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [scannerError, setScannerError] = useState(null);
  const scannerRef = useRef(null);
  const qrContainerRef = useRef(null);
  
  // QR Generation States
  const [qrText, setQrText] = useState('');
  const [generatedQr, setGeneratedQr] = useState('');
  const [showQrGenerator, setShowQrGenerator] = useState(false);
  
  // Chat States
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatActive, setChatActive] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  
  // Registration Form States
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleNumber: '',
    password: '',
    role: 'user'
  });

  // Mock owners data
  const owners = [
    { id: 1, name: 'Srinivas Reddy', phone: '+91 98765 43210', location: 'Hitech City', status: 'online', spots: ['P1-101', 'P1-102'] },
    { id: 2, name: 'Priya Sharma', phone: '+91 87654 32109', location: 'Gachibowli', status: 'online', spots: ['P2-201', 'P2-202'] },
    { id: 3, name: 'Rahul Verma', phone: '+91 76543 21098', location: 'Jubilee Hills', status: 'offline', spots: ['P3-301'] },
    { id: 4, name: 'Ananya Patel', phone: '+91 65432 10987', location: 'Banjara Hills', status: 'online', spots: ['P4-401', 'P4-402'] },
    { id: 5, name: 'Vikram Singh', phone: '+91 54321 09876', location: 'Madhapur', status: 'busy', spots: ['P5-501'] },
  ];

  // Parking spots with QR data
  const parkingSpots = [
    { id: 101, spot: 'P1-101', location: 'Block A', ownerId: 1, qrData: 'PARKING-SPOT-101' },
    { id: 102, spot: 'P1-102', location: 'Block A', ownerId: 1, qrData: 'PARKING-SPOT-102' },
    { id: 103, spot: 'P2-201', location: 'Block B', ownerId: 2, qrData: 'PARKING-SPOT-201' },
    { id: 104, spot: 'P2-202', location: 'Block B', ownerId: 2, qrData: 'PARKING-SPOT-202' },
    { id: 105, spot: 'P3-301', location: 'Block C', ownerId: 3, qrData: 'PARKING-SPOT-301' },
    { id: 106, spot: 'P4-401', location: 'Block D', ownerId: 4, qrData: 'PARKING-SPOT-401' },
    { id: 107, spot: 'P4-402', location: 'Block D', ownerId: 4, qrData: 'PARKING-SPOT-402' },
    { id: 108, spot: 'P5-501', location: 'Block E', ownerId: 5, qrData: 'PARKING-SPOT-501' },
  ];

  useEffect(() => {
    // Check if user is already registered
    const savedUser = localStorage.getItem('ownerChatUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserData(user);
      setIsRegistered(true);
      setUserRole(user.role || 'user');
    }
  }, []);

  // Initialize QR Scanner
  const startScanner = () => {
    if (!qrContainerRef.current) return;
    
    setScannerError(null);
    setQrResult(null);
    setIsScanning(true);

    const qrScanner = new Html5Qrcode("qr-reader");

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    qrScanner.start(
      { facingMode: "environment" },
      config,
      (decodedText, decodedResult) => {
        setQrResult(decodedText);
        setIsScanning(false);
        qrScanner.stop();
        handleQrSuccess(decodedText);
      },
      (errorMessage) => {
        // Ignore for scanning
      }
    ).catch((err) => {
      setScannerError('Could not access camera. Please check permissions.');
      setIsScanning(false);
    });

    scannerRef.current = qrScanner;
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current = null;
    }
    setIsScanning(false);
    setScannerError(null);
  };

  const handleQrSuccess = (data) => {
    // Check if it's a parking spot QR
    const spot = parkingSpots.find(p => p.qrData === data);
    if (spot) {
      setSelectedSpot(spot);
      const owner = owners.find(o => o.id === spot.ownerId);
      setSelectedOwner(owner);
      setChatActive(true);
      
      // Add system message
      addMessage({
        id: Date.now(),
        text: `📍 Parking violation reported at ${spot.spot} (${spot.location})`,
        sender: 'system',
        timestamp: new Date().toLocaleString()
      });
      
      // Auto-message to owner
      setTimeout(() => {
        addMessage({
          id: Date.now() + 1,
          text: `Hello ${owner?.name}, I've reported a parking violation at ${spot.spot}. Please check immediately.`,
          sender: 'user',
          timestamp: new Date().toLocaleString()
        });
      }, 1000);
    } else {
      // Try to parse as JSON for custom QR data
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.type === 'parking') {
          // Handle custom parking QR
          const spot = parkingSpots.find(p => p.id === parsedData.spotId);
          if (spot) {
            setSelectedSpot(spot);
            const owner = owners.find(o => o.id === spot.ownerId);
            setSelectedOwner(owner);
            setChatActive(true);
            addMessage({
              id: Date.now(),
              text: `📍 Parking violation reported at ${spot.spot}`,
              sender: 'system',
              timestamp: new Date().toLocaleString()
            });
          }
        }
      } catch (e) {
        setScannerError('Invalid QR Code. Please scan a valid parking spot QR.');
        setTimeout(() => {
          setQrResult(null);
          startScanner();
        }, 2000);
      }
    }
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleString()
    };
    
    addMessage(message);
    setNewMessage('');
    
    // Mock owner reply
    setTimeout(() => {
      const replies = [
        'Thank you for reporting. I will check immediately.',
        'I apologize for the inconvenience. I\'ll send someone now.',
        'This has been noted. We\'ll take action within 5 minutes.',
        'Please provide more details about the violation.',
        'We\'re on our way to resolve this issue.',
        'Thank you for bringing this to our attention.',
        'I\'ll have this resolved right away.'
      ];
      
      const reply = {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: 'owner',
        timestamp: new Date().toLocaleString()
      };
      addMessage(reply);
    }, 2000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const user = {
      ...regForm,
      id: Date.now(),
      registeredAt: new Date().toISOString()
    };
    setUserData(user);
    setIsRegistered(true);
    setUserRole(user.role);
    setShowRegistration(false);
    localStorage.setItem('ownerChatUser', JSON.stringify(user));
  };

  const handleInputChange = (e) => {
    setRegForm({
      ...regForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('ownerChatUser');
    setUserData(null);
    setIsRegistered(false);
    setMessages([]);
    setChatActive(false);
    setSelectedOwner(null);
    setSelectedSpot(null);
    setQrResult(null);
    stopScanner();
  };

  // Generate QR Code for parking spot
  const generateParkingQR = (spotId, spotNumber) => {
    const qrData = JSON.stringify({
      type: 'parking',
      spotId: spotId,
      spotNumber: spotNumber,
      location: parkingSpots.find(p => p.id === spotId)?.location || '',
      timestamp: new Date().toISOString()
    });
    setGeneratedQr(qrData);
    setQrText(qrData);
  };

  // Generate QR for owner
  const generateOwnerQR = (ownerId) => {
    const owner = owners.find(o => o.id === ownerId);
    const qrData = JSON.stringify({
      type: 'owner',
      ownerId: ownerId,
      name: owner?.name || '',
      phone: owner?.phone || '',
      location: owner?.location || '',
      timestamp: new Date().toISOString()
    });
    setGeneratedQr(qrData);
    setQrText(qrData);
  };

  // Render Registration
  const renderRegistration = () => (
    <div className={styles.registrationContainer}>
      <div className={styles.registrationCard}>
        <h2 className={styles.regTitle}>
          <span className={styles.gradientText}>Register</span>
        </h2>
        <p className={styles.regSubtitle}>
          Create an account to start reporting parking violations
        </p>
        <form onSubmit={handleRegister} className={styles.regForm}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={regForm.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={regForm.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={regForm.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="vehicleNumber"
              placeholder="Vehicle Number"
              value={regForm.vehicleNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={regForm.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <select
              name="role"
              value={regForm.role}
              onChange={handleInputChange}
              className={styles.roleSelect}
            >
              <option value="user">User (Report Violations)</option>
              <option value="owner">Owner (Manage Parking)</option>
            </select>
          </div>
          <button type="submit" className={styles.regButton}>
            Register & Continue
          </button>
        </form>
        <p className={styles.regLoginLink}>
          Already have an account? <span onClick={() => setIsLoginOpen(true)}>Login</span>
        </p>
      </div>
    </div>
  );

  // Render QR Code Generator
  const renderQRGenerator = () => (
    <div className={styles.qrGeneratorContainer}>
      <div className={styles.qrGeneratorCard}>
        <h3 className={styles.qrGeneratorTitle}>
          <span className={styles.qrIcon}>🔲</span> Generate QR Code
        </h3>
        <p className={styles.qrGeneratorSubtitle}>
          Create QR codes for parking spots or owner profiles
        </p>

        <div className={styles.qrGenerateOptions}>
          <div className={styles.qrOptionGroup}>
            <h4>Parking Spot QR</h4>
            <div className={styles.qrSpotList}>
              {parkingSpots.map((spot) => (
                <button
                  key={spot.id}
                  className={styles.qrOptionButton}
                  onClick={() => generateParkingQR(spot.id, spot.spot)}
                >
                  🅿️ {spot.spot} - {spot.location}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.qrOptionGroup}>
            <h4>Owner QR</h4>
            <div className={styles.qrSpotList}>
              {owners.map((owner) => (
                <button
                  key={owner.id}
                  className={styles.qrOptionButton}
                  onClick={() => generateOwnerQR(owner.id)}
                >
                  👤 {owner.name} - {owner.location}
                </button>
              ))}
            </div>
          </div>
        </div>

        {generatedQr && (
          <div className={styles.qrDisplay}>
            <div className={styles.qrCodeWrapper}>
              <QRCode value={generatedQr} size={200} level="H" />
            </div>
            <div className={styles.qrActions}>
              <button 
                className={styles.downloadQrButton}
                onClick={() => {
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const link = document.createElement('a');
                    link.download = 'parking-qr.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  }
                }}
              >
                📥 Download QR
              </button>
              <button 
                className={styles.copyQrButton}
                onClick={() => {
                  navigator.clipboard.writeText(generatedQr);
                  alert('QR data copied to clipboard!');
                }}
              >
                📋 Copy Data
              </button>
            </div>
            <div className={styles.qrDataDisplay}>
              <p><strong>QR Data:</strong></p>
              <code>{generatedQr}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render Scanner
  const renderScanner = () => (
    <div className={styles.scannerContainer}>
      <div className={styles.scannerCard}>
        <h3 className={styles.scannerTitle}>
          <span className={styles.scannerIcon}>📷</span> Scan QR Code
        </h3>
        <p className={styles.scannerSubtitle}>
          Scan the QR code on the parking spot to report a violation
        </p>
        
        {!isScanning && !qrResult && (
          <button 
            onClick={startScanner} 
            className={styles.scanButton}
          >
            <span>🔍</span> Start Scanning
          </button>
        )}

        {(isScanning || qrResult) && (
          <div className={styles.qrReaderWrapper}>
            <div id="qr-reader" ref={qrContainerRef} className={styles.qrReader}></div>
            
            {scannerError && scannerError !== 'Scanning...' && (
              <div className={styles.scannerError}>
                ⚠️ {scannerError}
              </div>
            )}
            
            {qrResult && (
              <div className={styles.qrResult}>
                <div className={styles.qrSuccess}>
                  <span className={styles.qrSuccessIcon}>✅</span>
                  <p>QR Code Scanned Successfully!</p>
                  <p className={styles.qrData}>
                    {parkingSpots.find(p => p.qrData === qrResult)?.spot || 
                     JSON.parse(qrResult)?.spotNumber || 'Unknown Spot'}
                  </p>
                </div>
              </div>
            )}
            
            <button onClick={stopScanner} className={styles.stopScanButton}>
              {qrResult ? 'Scan Another' : 'Stop Scanning'}
            </button>
          </div>
        )}

        <div className={styles.scannerHelp}>
          <p>💡 How to use:</p>
          <ul>
            <li>Point your camera at the QR code on parking spot</li>
            <li>Auto-detect will identify the parking location</li>
            <li>You'll be connected to the owner for reporting</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Render Chat
  const renderChat = () => (
    <div className={styles.chatContainer}>
      <div className={styles.chatCard}>
        {/* Chat Header */}
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderLeft}>
            <div className={styles.ownerAvatar}>
              {selectedOwner ? selectedOwner.name[0] : 'O'}
            </div>
            <div className={styles.ownerInfo}>
              <h4 className={styles.ownerName}>
                {selectedOwner?.name || 'Parking Owner'}
              </h4>
              {selectedSpot && (
                <span className={styles.spotInfo}>
                  🅿️ {selectedSpot.spot} • {selectedSpot.location}
                </span>
              )}
              <span className={`${styles.ownerStatus} ${selectedOwner?.status === 'online' ? styles.statusOnline : selectedOwner?.status === 'busy' ? styles.statusBusy : styles.statusOffline}`}>
                {selectedOwner?.status || 'online'}
              </span>
            </div>
          </div>
          <div className={styles.chatHeaderRight}>
            <button 
              onClick={() => {
                setShowQrGenerator(true);
              }} 
              className={styles.qrButton}
              title="Generate QR Code"
            >
              🔲
            </button>
            <button onClick={() => {
              setChatActive(false);
              setMessages([]);
              setSelectedOwner(null);
              setSelectedSpot(null);
              setQrResult(null);
            }} className={styles.closeChatButton}>
              ✕
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className={styles.chatMessages}>
          {messages.length === 0 ? (
            <div className={styles.emptyChat}>
              <span className={styles.emptyChatIcon}>💬</span>
              <p>No messages yet</p>
              <p className={styles.emptyChatSub}>Scan QR to start conversation</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`${styles.message} ${
                  msg.sender === 'user' ? styles.userMessage : 
                  msg.sender === 'system' ? styles.systemMessage : 
                  styles.ownerMessage
                }`}
              >
                <div className={styles.messageContent}>
                  {msg.sender === 'system' && (
                    <span className={styles.systemIcon}>ℹ️</span>
                  )}
                  {msg.sender === 'owner' && (
                    <div className={styles.ownerAvatarSmall}>
                      {selectedOwner?.name[0] || 'O'}
                    </div>
                  )}
                  <div className={styles.messageText}>
                    <p>{msg.text}</p>
                    <span className={styles.messageTime}>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat Input */}
        <div className={styles.chatInput}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className={styles.messageInput}
          />
          <button onClick={handleSendMessage} className={styles.sendButton}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );

  // Render Dashboard
  const renderDashboard = () => (
    <div className={styles.dashboardContainer}>
      {/* User Info Card */}
      <div className={styles.userCard}>
        <div className={styles.userAvatar}>
          {userData?.name?.[0] || 'U'}
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{userData?.name || 'User'}</h3>
          <p className={styles.userRole}>👤 {userRole === 'owner' ? 'Parking Owner' : 'User'}</p>
          <p className={styles.userVehicle}>🚗 {userData?.vehicleNumber || 'No Vehicle'}</p>
          <p className={styles.userPhone}>📱 {userData?.phone || 'No Phone'}</p>
        </div>
        <div className={styles.userActions}>
          {userRole === 'owner' && (
            <button 
              onClick={() => setShowQrGenerator(!showQrGenerator)} 
              className={styles.qrGeneratorToggle}
            >
              {showQrGenerator ? 'Hide QR Generator' : 'Generate QR Codes'}
            </button>
          )}
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📊</span>
          <div>
            <p className={styles.statNumber}>12</p>
            <p className={styles.statLabel}>Reports Today</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>✅</span>
          <div>
            <p className={styles.statNumber}>8</p>
            <p className={styles.statLabel}>Resolved</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>⏳</span>
          <div>
            <p className={styles.statNumber}>4</p>
            <p className={styles.statLabel}>Pending</p>
          </div>
        </div>
      </div>

      {/* QR Generator */}
      {showQrGenerator && renderQRGenerator()}

      {/* Scanner or Chat */}
      {!chatActive ? renderScanner() : renderChat()}
    </div>
  );

  return (
    <>
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <SocialSidebar />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerGlow}></div>
          <div className={styles.aiBadge}>
            <span className={styles.pulseDot}></span>
            Parking Violation Reporting System
          </div>
          <h1 className={styles.title}>
            <span className={styles.gradientText}>Owner</span> Chat System
          </h1>
          <p className={styles.subtitle}>
            Report wrong parking by scanning QR code
          </p>
          <p className={styles.description}>
            Scan the QR code at any parking spot to instantly connect with the owner
            and report violations. Quick, easy, and efficient.
          </p>
        </div>

        {/* Main Content */}
        {!isRegistered ? renderRegistration() : renderDashboard()}
        
        {/* Features */}
        <section className={styles.featuresSection}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <span className={styles.featureIcon}>📱</span>
            </div>
            <h3 className={styles.featureTitle}>Easy QR Scan</h3>
            <p className={styles.featureText}>
              Just point your camera at any parking spot QR code to report violations instantly.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <span className={styles.featureIcon}>💬</span>
            </div>
            <h3 className={styles.featureTitle}>Real-time Chat</h3>
            <p className={styles.featureText}>
              Connect directly with parking owners and get immediate response to your reports.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <span className={styles.featureIcon}>🔲</span>
            </div>
            <h3 className={styles.featureTitle}>QR Code Generation</h3>
            <p className={styles.featureText}>
              Owners can generate QR codes for their parking spots for easy violation reporting.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <span className={styles.featureIcon}>🔒</span>
            </div>
            <h3 className={styles.featureTitle}>Secure & Private</h3>
            <p className={styles.featureText}>
              Your reports are confidential and only shared with the relevant parking owner.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}