import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; 

const Ticker = () => {
  const [latestReports, setLatestReports] = useState([]);

  useEffect(() => {
    // Basic query to fetch latest 8 reports
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
      setLatestReports(reports);
    }, (error) => {
        console.error("Ticker Firebase Error:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-dark text-white py-2 overflow-hidden border-bottom border-secondary" 
         style={{ fontSize: '0.85rem', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 1000 }}>
      <div className="ticker-container d-flex align-items-center">
        <div className="ticker-move">
          <span className="mx-4 text-warning fw-bold">
            <i className="bi bi-megaphone-fill me-2"></i> LIVE MARKET UPDATES:
          </span>
          
          {latestReports.length > 0 ? (
            latestReports.map((report) => (
              <span key={report.id} className="mx-4">
                <span className="text-info fw-bold">{report.userName || "User"}</span>: 
                <span className="text-success"> {report.itemName}</span> - 
                <span className="text-white"> ₦{report.price}</span>
                <span className="ms-4 text-muted opacity-25">|</span>
              </span>
            ))
          ) : (
            <span className="mx-4">Scanning MarketWatch Network...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticker;