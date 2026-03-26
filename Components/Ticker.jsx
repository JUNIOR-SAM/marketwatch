import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../src/firebase'; 

const Ticker = () => {
  const [latestReports, setLatestReports] = useState([]);

  useEffect(() => {
    // FIXED: Changed 'timestamp' to 'createdAt' to match your Firestore screenshot
    const q = query(
      collection(db, "price_reports"), 
      orderBy("createdAt", "desc"), 
      limit(8)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Ticker received data:", reports); // Keep an eye on your F12 console
      setLatestReports(reports);
    }, (error) => {
        console.error("Ticker Error:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-dark text-white py-2 overflow-hidden border-bottom border-secondary" 
         style={{ fontSize: '0.85rem', backdropFilter: 'blur(10px)', zIndex: 1000 }}>
      <div className="ticker-container d-flex align-items-center">
        <div className="ticker-move">
          <span className="mx-4 text-warning fw-bold">
            <i className="bi bi-megaphone-fill me-2"></i>LIVE MARKET UPDATES:
          </span>
          
          {latestReports.length > 0 ? (
            latestReports.map((report, index) => (
              <span key={index} className="mx-4">
                {/* Fixed userName and market fields based on your logic */}
                <span className="text-info fw-bold">{report.userName || "A Trader"}</span> reported 
                <span className="text-success fw-bold"> {report.itemName?.toUpperCase()}</span> at 
                <span className="fw-bold text-white"> ₦{Number(report.price).toLocaleString()}</span> in 
                <span className="text-warning"> {report.market || report.city || "Local Market"}</span>
                <span className="ms-4 text-muted opacity-25">|</span>
              </span>
            ))
          ) : (
            <span className="mx-4">Connecting to MarketWatch Network... scanning for latest prices...</span>
          )}
        </div>
      </div>

      <style>{`
        .ticker-container {
          width: 100%;
          white-space: nowrap;
        }
        .ticker-move {
          display: inline-block;
          padding-left: 100%;
          animation: ticker-animation 45s linear infinite;
        }
        .ticker-move:hover {
          animation-play-state: paused;
          cursor: pointer;
        }
        @keyframes ticker-animation {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Ticker;