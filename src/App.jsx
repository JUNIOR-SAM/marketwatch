import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// 1. IMPORT YOUR 3 CSS FILES HERE
// This ensures GitHub Pages loads your design and animations
import './index.css';           // Your main animations & global styles
import './App.css';             // Your general layout styles
import './Css/Nav.css';         // Your Navigation specific styles

// 2. Component Imports
import Ticker from './Components/Ticker.jsx';
import Nav from './Components/Nav.jsx';
import Hero from './Components/Hero.jsx';
import SearchVerify from './Components/SearchVerify.jsx';
import ReportPrice from './Components/ReportPrice.jsx';
import SignUp from './Components/SignUp.jsx'; 
import SignIn from './Components/SignIn.jsx'; 
import LivePrices from './Components/LivePrices.jsx';
import MyReports from './Components/MyReports.jsx'; 

const AppContent = () => {
  const location = useLocation();
  
  // Define which pages are "Auth" pages (where we show the special background)
  const authPaths = ['/', '/signin', '/signup'];
  
  // Clean up the path to handle trailing slashes correctly
  const currentPath = location.pathname.replace(/\/$/, "") || "/"; 
  
  const isAuthPage = authPaths.includes(currentPath);

  return (
    /* This "auth-bg" class must be defined in your index.css or App.css for animations to work */
    <div className={isAuthPage ? "auth-bg" : "app-container"}>
      
      {/* Show Ticker and Nav ONLY if we are NOT on a login/signup page */}
      {!isAuthPage && <Ticker />}
      {!isAuthPage && <Nav />}
      
      <div className="content-area">
        <Routes>
          {/* Default Page is SignUp */}
          <Route path="/" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route path="/dashboard" element={
            <>
              <Hero />
              <SearchVerify />
            </>
          } />
          
          <Route path="/report" element={<ReportPrice />} />
          <Route path="/live-prices" element={<LivePrices />} />
          <Route path="/my-reports" element={<MyReports />} /> 

          {/* Catch-all: If user goes to a broken link, send them to SignUp */}
          <Route path="*" element={<SignUp />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router 
      /* No basename needed for HashRouter on GitHub Pages */
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