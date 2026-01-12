import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MobileApp.css';

// Import all screens
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import { SendScreen, ReceiveScreen } from './SendReceiveScreen';
import TransactionHistory from './TransactionHistory';
import { LoginScreen, OTPScreen, PINScreen, OnboardingScreens } from './AuthScreens';
import BottomNav from './BottomNav';
import SettingsScreen from './SettingsScreen';
import NotificationsScreen from './NotificationsScreen';

function MobileApp({ account, setAccount, tokenContracts, contract }) {
  const [activeScreen, setActiveScreen] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');

  // Show toast notifications
  const showToast = (message, type = 'info') => {
    toast[type](message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleConnect = () => {
    setIsAuthenticated(true);
    setAccount('0x742d35Cc6634C0532925a3b844Bc9e7595f4f2a');
    showToast('Wallet connected successfully!', 'success');
  };

  const handlePINComplete = () => {
    setIsAuthenticated(true);
    showToast('PIN verified successfully!', 'success');
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingComplete', 'true');
  };

  // Check if onboarding was completed
  React.useEffect(() => {
    const completed = localStorage.getItem('onboardingComplete');
    if (completed) {
      setShowOnboarding(false);
    }
  }, []);

  // Show onboarding
  if (showOnboarding) {
    return <OnboardingScreens onComplete={handleOnboardingComplete} />;
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen onConnect={handleConnect} />
        <ToastContainer theme={theme} />
      </>
    );
  }

  // Render active screen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen account={account} tokenContracts={tokenContracts} />;
      case 'send':
        return <SendScreen account={account} tokenContracts={tokenContracts} />;
      case 'scan':
        return <ReceiveScreen account={account} />;
      case 'history':
        return <TransactionHistory />;
      case 'profile':
        return <ProfileScreen account={account} />;
      case 'settings':
        return <SettingsScreen 
          theme={theme} 
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
        />;
      case 'notifications':
        return <NotificationsScreen />;
      default:
        return <HomeScreen account={account} tokenContracts={tokenContracts} />;
    }
  };

  return (
    <div className={`mobile-app ${theme}`}>
      {renderScreen()}
      <BottomNav activeTab={activeScreen} onTabChange={setActiveScreen} />
      <ToastContainer theme={theme} />
    </div>
  );
}

export default MobileApp;
