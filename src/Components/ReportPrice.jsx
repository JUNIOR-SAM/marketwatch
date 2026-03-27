import React, { useState } from 'react';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth'; 
import { db } from '../firebase'; 
import { nigeriaStates } from '../Data/nigeria'; 

const ReportPrice = () => {
  const auth = getAuth(); 
  const user = auth.currentUser;

  const [itemName, setItemName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [market, setMarket] = useState(''); 
  const [newPrice, setNewPrice] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleStateChange = (e) => {
    setState(e.target.value);
    setCity(''); 
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('⌛ Broadcasting to MarketWatch Network...');

    try {
      // NORMALIZATION: Force Item to lowercase for searching/indexing
      const formattedItem = itemName.toLowerCase().trim();
      
      // CAPITALIZATION LOGIC: First letter Capital, others small for Market Name
      const formattedMarket = market.trim().charAt(0).toUpperCase() + market.trim().slice(1).toLowerCase();
      
      const reporterName = user?.displayName || user?.email?.split('@')[0] || "Anonymous";

      // 1. Update the Main Price Record
      const itemRef = doc(db, 'current_prices', formattedItem);
      await setDoc(itemRef, {
        average_price: Number(newPrice),
        last_reported_state: state,
        last_reported_city: city,
        last_reported_market: formattedMarket, // Now saved as "Sabo" even if typed "sabo"
        updatedAt: serverTimestamp() 
      }, { merge: true });

      // 2. Save to Global Price History
      await addDoc(collection(db, 'price_reports'), {
        itemName: formattedItem,
        price: Number(newPrice),
        state: state,
        city: city,
        market: formattedMarket, // Now saved as "Sabo" even if typed "sabo"
        userName: reporterName,
        createdAt: serverTimestamp() 
      });

      // Reset form fields
      setItemName(''); setState(''); setCity(''); setMarket(''); setNewPrice('');
      setStatusMessage(' Success! Your report is now live for the community.');
      setTimeout(() => setStatusMessage(''), 4000);

    } catch (error) {
      console.error("Error:", error);
      setStatusMessage('❌ Error updating price. Please try again.');
    }
  };

  return (
    <div className="container mt-5 py-5" style={{ maxWidth: '850px' }}>
       <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5">
        <div className="text-center mb-4">
          <span className="badge bg-light text-success mb-2 px-3 py-2 rounded-pill border">Marketwatch</span>
          <h2 className="fw-bold" style={{ color: '#0f172a' }}>Report a Market Price</h2>
          <p className="text-muted small">Select your location to help others find the best deals.</p>
        </div>
        
        <form onSubmit={handlePriceSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">What did you buy?</label>
            <input 
              type="text" 
              className="form-control form-control-lg bg-light border-0" 
              placeholder="e.g., Garri, Yam, Petrol..." 
              value={itemName} 
              onChange={(e) => setItemName(e.target.value)} 
              required 
            />
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label fw-bold small text-uppercase">State</label>
              <select className="form-select bg-light border-0 py-2" value={state} onChange={handleStateChange} required>
                <option value="">Choose State</option>
                {Object.keys(nigeriaStates).sort().map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold small text-uppercase">City/LGA</label>
              <select 
                className="form-select bg-light border-0 py-2" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                required 
                disabled={!state}
              >
                <option value="">{state ? "Select City" : "Pick State"}</option>
                {state && nigeriaStates[state].sort().map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold small text-uppercase">Market Name</label>
              <input 
                type="text" 
                className="form-control bg-light border-0 py-2" 
                placeholder="Sabo, Bodija, etc." 
                value={market} 
                onChange={(e) => setMarket(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Price Paid (₦)</label>
            <input 
              type="number" 
              className="form-control form-control-lg bg-light border-0 text-success fw-bold" 
              placeholder="1500" 
              value={newPrice} 
              onChange={(e) => setNewPrice(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-lg w-100 text-white rounded-pill shadow-sm fw-bold" style={{ backgroundColor: '#10b981' }}>
            Broadcasting Live Price
          </button>
        </form>

        {statusMessage && (
          <div className="alert alert-success mt-4 rounded-3 border-0 text-center fw-medium shadow-sm">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPrice;