import React from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// Change this import in App.jsx
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// The rest of your App.jsx stays the same!
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
  
  // Hide Navbar on Signup (/) and Signin (/signin)
// Change this line:
const isAuthPage = ['/', '/signin', ''].includes(location.pathname.replace(/\/$/, ""));
  return (
    <div className={isAuthPage ? "auth-bg" : ""}>
      {!isAuthPage && <Nav />}
      
      <Routes>
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