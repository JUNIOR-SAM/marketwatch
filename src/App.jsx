import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// The rest of your App.jsx stays the same!
import Nav from '../Components/Nav.jsx';
import Hero from '../Components/Hero.jsx';
import SearchVerify from '../Components/SearchVerify.jsx';
import ReportPrice from '../Components/ReportPrice.jsx';
import SignUp from '../Components/SignUp.jsx'; 
import SignIn from '../Components/SignIn.jsx'; 
import './App.css';

// Sub-component to manage the layout
const AppContent = () => {
  const location = useLocation();
  
  // Hide Navbar on Signup (/) and Signin (/signin)
  const isAuthPage = location.pathname === '/' || location.pathname === '/signin';

  return (
    <div className={isAuthPage ? "auth-bg" : ""}>
      {!isAuthPage && <Nav />}
      
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Main App Section */}
        <Route path="/dashboard" element={
          <>
            <Nav />
            <Hero />
            <SearchVerify />
          </>
        } />
        
        <Route path="/report" element={<ReportPrice />} />
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