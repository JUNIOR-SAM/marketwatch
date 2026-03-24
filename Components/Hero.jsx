import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../src/firebase'; // This points to your new firebase.js file!
import '../Css/Hero.css';

// Find this line in Hero.jsx and add the id:
<div id="prices-section" className="container text-center hero-section"></div>

const Hero = () => {
  // State variables to hold our live prices
  const [petrolPrice, setPetrolPrice] = useState("Loading...");
  const [ricePrice, setRicePrice] = useState("Loading...");
  const [dataPrice, setDataPrice] = useState("Loading...");

  useEffect(() => {
    // 1. Listen to the "petrol" document in real-time
    const unsubPetrol = onSnapshot(doc(db, "current_prices", "petrol"), (doc) => {
      if (doc.exists()) {
        // .toLocaleString() automatically adds commas! (e.g., 1250 becomes 1,250)
        setPetrolPrice("₦" + doc.data().average_price.toLocaleString());
      }
    });

    // 2. Listen to the "rice" document in real-time
    const unsubRice = onSnapshot(doc(db, "current_prices", "rice"), (doc) => {
      if (doc.exists()) {
        setRicePrice("₦" + doc.data().average_price.toLocaleString());
      }
    });

    // 3. Listen to the "data" document in real-time
    const unsubData = onSnapshot(doc(db, "current_prices", "data"), (doc) => {
      if (doc.exists()) {
        setDataPrice("₦" + doc.data().average_price.toLocaleString());
      }
    });

    // Cleanup listeners when the user leaves the page
    return () => {
      unsubPetrol();
      unsubRice();
      unsubData();
    };
  }, []);

  return (
    <div className="container text-center hero-section">
      <div className="mb-5">
        <h1 className="fw-bold display-4" style={{ color: '#0f172a' }}>
          Track Everyday Prices in Real-Time
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Stay ahead of inflation. Compare crowdsourced prices for food, fuel, and data in your area.
        </p>
      </div>

      <div className="row g-4 justify-content-center">
        
        {/* Card 1: Fuel */}
        <div className="col-12 col-md-4">
          <div className="card price-card border-0">
            <div className="card-body py-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted fw-semibold">Petrol (1 Liter)</span>
                <span className="badge rounded-pill" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>Live</span>
              </div>
              <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{petrolPrice}</h2>
              <p className="mb-0 text-danger fw-medium small">
                ▲ High volatility
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Rice */}
        <div className="col-12 col-md-4">
          <div className="card price-card border-0">
            <div className="card-body py-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted fw-semibold">Rice (50kg Bag)</span>
                <span className="badge rounded-pill" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>Live</span>
              </div>
              <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{ricePrice}</h2>
              <p className="mb-0 text-success fw-medium small">
                ▼ Prices dropping slightly
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Data */}
        <div className="col-12 col-md-4">
          <div className="card price-card border-0">
            <div className="card-body py-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted fw-semibold">Data (1GB - MTN)</span>
                <span className="badge rounded-pill" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>Live</span>
              </div>
              <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{dataPrice}</h2>
              <p className="mb-0 text-muted fw-medium small">
                ▬ Stable
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Hero;