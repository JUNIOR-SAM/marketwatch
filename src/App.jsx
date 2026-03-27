import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Lively Components
import Ticker from '../Components/Ticker.jsx';

// Core Components
import Nav from '../Components/Nav.jsx';
import Hero from '../Components/Hero.jsx';
import SearchVerify from '../Components/SearchVerify.jsx';
import ReportPrice from '../Components/ReportPrice.jsx';
import SignUp from '../Components/SignUp.jsx'; 
import SignIn from '../Components/SignIn.jsx'; 
import LivePrices from '../Components/LivePrices.jsx';
import MyReports from '../Components/MyReports.jsx'; 
import './App.css';

const AppContent = () => {
  const location = useLocation();
  
  // Define authentication pages where Nav/Ticker should be hidden
  const authPaths = ['/', '/signin', '/signup'];
  const currentPath = location.pathname.replace(/\/$/, ""); 
  
  const isAuthPage = authPaths.includes(currentPath) || currentPath === "";

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
          </>
        } />
        
        <Route path="/report" element={<ReportPrice />} />
        <Route path="/live-prices" element={<LivePrices />} />
        <Route path="/my-reports" element={<MyReports />} /> 

        {/* Catch-all sends users to SignUp if page doesn't exist */}
        <Route path="*" element={<SignUp />} />
      </Routes>
    </div>
  );
};

const App = () => {
  // DYNAMIC FIX: Check if the site is being hosted on GitHub Pages
  // If the URL contains 'github.io', we use '/marketwatch'. 
  // Otherwise (on Vercel or Localhost), we use an empty string.
  const isGitHubPages = window.location.hostname.includes('github.io');
  const dynamicBasename = isGitHubPages ? "/marketwatch" : "";

  return (
    <Router 
      basename={dynamicBasename} 
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