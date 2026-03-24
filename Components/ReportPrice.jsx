import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../src/firebase'; 

const ReportPrice = () => {
  const [itemName, setItemName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [market, setMarket] = useState(''); // NEW: Added Market state
  const [newPrice, setNewPrice] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('⌛ Broadcasting to MarketWatch Network...');

    try {
      const formattedItem = itemName.toLowerCase().trim();
      const itemRef = doc(db, 'current_prices', formattedItem);

      // Now saving State, City, AND Market to Firebase
      await setDoc(itemRef, {
        average_price: Number(newPrice),
        last_reported_state: state,
        last_reported_city: city,
        last_reported_market: market, // NEW: Added to database
        updatedAt: new Date()
      }, { merge: true });

      // Clear all fields
      setItemName(''); setState(''); setCity(''); setMarket(''); setNewPrice('');
      
      setStatusMessage('✅ Success! Your report is now live for the community.');
      setTimeout(() => setStatusMessage(''), 4000);

    } catch (error) {
      console.error("Error:", error);
      setStatusMessage('❌ Error updating price. Please try again.');
    }
  };

  return (
    <div className="container mt-5 py-5" style={{ maxWidth: '750px' }}>
      <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5">
        <div className="text-center mb-4">
          <span className="badge bg-light text-success mb-2 px-3 py-2 rounded-pill border">Crowdsource Data</span>
          <h2 className="fw-bold" style={{ color: '#0f172a' }}>Report a Market Price</h2>
          <p className="text-muted small">Specify the market so others know exactly where to find this price.</p>
        </div>
        
        <form onSubmit={handlePriceSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">What did you buy?</label>
            <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="e.g., Garri, Yam, Petrol..." value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">State</label>
              <input type="text" className="form-control bg-light border-0" placeholder="Oyo" value={state} onChange={(e) => setState(e.target.value)} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">City</label>
              <input type="text" className="form-control bg-light border-0" placeholder="Ogbomoso" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className="col-md-4">
              {/* NEW: Market Input Field */}
              <label className="form-label fw-bold">Market Name</label>
              <input type="text" className="form-control bg-light border-0" placeholder="e.g., Sabo Market" value={market} onChange={(e) => setMarket(e.target.value)} required />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Price Paid (₦)</label>
            <input type="number" className="form-control form-control-lg bg-light border-0 text-success fw-bold" placeholder="1500" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-lg w-100 text-white rounded-pill shadow-sm fw-bold" style={{ backgroundColor: '#10b981' }}>
            Submit Live Price
          </button>
        </form>

        {statusMessage && (
          <div className="alert alert-success mt-4 rounded-3 border-0 text-center fw-medium">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPrice;