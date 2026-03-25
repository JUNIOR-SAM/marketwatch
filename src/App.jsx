import React from 'react';
// MUST use HashRouter for GitHub Pages to avoid 404s on refresh
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Nav from '../Components/Nav.jsx';
import Hero from '../Components/Hero.jsx';
import SearchVerify from '../Components/SearchVerify.jsx';
import ReportPrice from '../Components/ReportPrice.jsx';
import SignUp from '../Components/SignUp.jsx'; 
import SignIn from '../Components/SignIn.jsx'; 
import LivePrices from '../Components/LivePrices.jsx';
import './App.css';

// Sub-component to manage the layout
const AppContent = () => {
  const location = useLocation();
  
  // Clean logic to hide Navbar on Auth pages
  // We check for '/', '/signin', and empty paths
  const authPaths = ['/', '/signin', ''];
  const currentPath = location.pathname.replace(/\/$/, ""); 
  const isAuthPage = authPaths.includes(currentPath) || location.pathname === "/marketwatch/";

  return (
    <div className={isAuthPage ? "auth-bg" : ""}>
      {/* Navbar only shows when NOT on Sign Up or Sign In */}
      {!isAuthPage && <Nav />}
      
      <Routes>
        {/* Default Landing Page */}
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Main App Section */}
        <Route path="/dashboard" element={
          <>
            <Hero />
            <SearchVerify />
          </>
        } />
        
        <Route path="/report" element={<ReportPrice />} />
        <Route path="/live-prices" element={<LivePrices />} />

        {/* Catch-all: Redirects any unknown path (like /marketwatch/) to SignUp */}
        <Route path="*" element={<SignUp />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;