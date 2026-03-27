import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import { db } from '../firebase'; 
import '../Css/Hero.css';

const Hero = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  // --- TIME ADAPTIVE LOGIC ADDED ---
  const [greeting, setGreeting] = useState("Welcome back");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);
  // ---------------------------------

  const displayName = user?.displayName || user?.email?.split('@')[0] || "Trader";

  const [petrolPrice, setPetrolPrice] = useState("Loading...");
  const [ricePrice, setRicePrice] = useState("Loading...");
  const [dataPrice, setDataPrice] = useState("Loading...");

  useEffect(() => {
    const unsubPetrol = onSnapshot(doc(db, "current_prices", "petrol"), (doc) => {
      if (doc.exists()) setPetrolPrice("₦" + doc.data().average_price.toLocaleString());
    });
    const unsubRice = onSnapshot(doc(db, "current_prices", "rice"), (doc) => {
      if (doc.exists()) setRicePrice("₦" + doc.data().average_price.toLocaleString());
    });
    const unsubData = onSnapshot(doc(db, "current_prices", "data"), (doc) => {
      if (doc.exists()) setDataPrice("₦" + doc.data().average_price.toLocaleString());
    });
    return () => { unsubPetrol(); unsubRice(); unsubData(); };
  }, []);

  return (
    <div className="container text-center hero-section">
      
      {/* PERSONAL WELCOME BANNER (Kept exactly as you styled it) */}
      <div className="d-flex justify-content-center mb-3"> 
        <div className="alert border shadow-sm border-success bg-white rounded-pill px-4 py-2 d-flex align-items-center">
            <span className="me-2 text-small">👋</span>
            <span className="text-muted small">{greeting}, </span> {/* Changed static text to {greeting} */}
            <span className="ms-1 fw-bold text-dark small">{displayName}</span>
        </div>
      </div>

      <div className="mb-5">
        <h1 className="fw-bold display-4" style={{ color: '#0f172a' }}>
          Track Everyday Prices in Real-Time
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Stay ahead of inflation. Compare crowdsourced prices for food, fuel, and data in your area.
        </p>
      </div>

      {/* YOUR 3 PRICE CARDS (Unchanged) */}
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-md-4">
          <div className="card price-card border-0 shadow-sm"> {/* Added shadow-sm here to make it look "bigger/lively" as requested */}
            <div className="card-body py-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted fw-semibold">Petrol (1 Liter)</span>
                <span className="badge rounded-pill" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>Live</span>
              </div>
              <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{petrolPrice}</h2>
              <p className="mb-0 text-danger fw-medium small">▲ High volatility</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card price-card border-0 shadow-sm">
            <div className="card-body py-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted fw-semibold">Rice (50kg Bag)</span>
                <span className="badge rounded-pill" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>Live</span>
              </div>
              <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{ricePrice}</h2>
              <p className="mb-0 text-success fw-medium small">▼ Prices dropping slightly</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card price-card border-0 shadow-sm">
            <div className="card-body py-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted fw-semibold">Data (1GB - MTN)</span>
                <span className="badge rounded-pill" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>Live</span>
              </div>
              <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{dataPrice}</h2>
              <p className="mb-0 text-muted fw-medium small">▬ Stable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;