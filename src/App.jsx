import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Lively Components
import Ticker from '../Components/Ticker.jsx';
// Leaderboard import removed

// Core Components
import Nav from '../Components/Nav.jsx';
import Hero from '../Components/Hero.jsx';
import SearchVerify from '../Components/SearchVerify.jsx';
import ReportPrice from '../Components/ReportPrice.jsx';
import SignUp from '../Components/SignUp.jsx'; 
import SignIn from '../Components/SignIn.jsx'; 
import LivePrices from '../Components/LivePrices.jsx';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  
  const authPaths = ['/', '/signin', ''];
  const currentPath = location.pathname.replace(/\/$/, ""); 
  const isAuthPage = authPaths.includes(currentPath) || location.pathname === "/marketwatch/";

  return (
    <div className={isAuthPage ? "auth-bg" : ""}>
      {!isAuthPage && <Ticker />}
      {!isAuthPage && <Nav />}
      
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        
        <Route path="/dashboard" element={
          <>
            <Hero />
            <SearchVerify />
            {/* Leaderboard removed for a cleaner B.B Art look */}
          </>
        } />
        
        <Route path="/report" element={<ReportPrice />} />
        <Route path="/live-prices" element={<LivePrices />} />

        <Route path="*" element={<SignUp />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router 
      future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}
    >
      <AppContent />
    </Router>
  );
};

export default App;