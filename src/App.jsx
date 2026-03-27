import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Lively Components (Changed from ../ to ./)
import Ticker from './Components/Ticker.jsx';

// Core Components (Changed from ../ to ./)
import Nav from './Components/Nav.jsx';
import Hero from './Components/Hero.jsx';
import SearchVerify from './Components/SearchVerify.jsx';
import ReportPrice from './Components/ReportPrice.jsx';
import SignUp from './Components/SignUp.jsx'; 
import SignIn from './Components/SignIn.jsx'; 
import LivePrices from './Components/LivePrices.jsx';
import MyReports from './Components/MyReports.jsx'; 

// CSS Import (Changed from ./App.css to ./Css/App.css if you moved it there)
import './Css/Nav.css'; // Adjust based on your actual file name in the Css folder

const AppContent = () => {
  const location = useLocation();
  
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

        <Route path="*" element={<SignUp />} />
      </Routes>
    </div>
  );
};

const App = () => {
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