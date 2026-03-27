import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { db } from '../src/firebase';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const myName = user.displayName || user.email.split('@')[0];
        
        // REMOVED: orderBy here to prevent the "disappearing" bug
        const q = query(
          collection(db, "price_reports"),
          where("userName", "==", myName)
        );

        const unsubscribeSnap = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // SORTING MANUALLY: This keeps your reports visible even during a reload!
          const sortedData = data.sort((a, b) => {
            const timeA = a.createdAt?.toMillis() || Date.now();
            const timeB = b.createdAt?.toMillis() || Date.now();
            return timeB - timeA;
          });

          setReports(sortedData);
          setLoading(false);
        }, (error) => {
          console.error("Firestore Error:", error);
          setLoading(false);
        });

        return () => unsubscribeSnap();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  // EDIT FUNCTION (Triggers alert for others)
  const handleEdit = async (reportId, itemName, oldPrice) => {
    const newPrice = prompt(`Update market price for ${itemName.toUpperCase()}:`, oldPrice);
    
    if (newPrice && !isNaN(newPrice) && Number(newPrice) !== oldPrice) {
      try {
        const reportRef = doc(db, "price_reports", reportId);
        await updateDoc(reportRef, {
          price: Number(newPrice),
          createdAt: serverTimestamp(), 
          isEdited: true
        });

        const itemRef = doc(db, "current_prices", itemName.toLowerCase());
        await updateDoc(itemRef, {
          average_price: Number(newPrice),
          updatedAt: serverTimestamp()
        });

        alert("Price updated and alert sent!");
      } catch (err) {
        alert("Update failed.");
      }
    }
  };

  // DELETE FUNCTION
  const handleDelete = async (id) => {
    if (window.confirm("Delete this report?")) {
      try {
        await deleteDoc(doc(db, "price_reports", id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  if (loading) return (
    <div className="text-center mt-5 py-5">
      <div className="spinner-border text-success" role="status"></div>
      <p className="mt-3 text-muted">Retrieving your marketwatch history...</p>
    </div>
  );

  return (
    <div className="container mt-5 pt-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0" style={{ color: '#0f172a' }}>My Price Contributions</h3>
        <span className="badge bg-success rounded-pill px-3 py-2 shadow-sm">Total: {reports.length}</span>
      </div>
      
      {reports.length > 0 ? (
        <div className="row g-3">
          {reports.map((report) => (
            <div className="col-12 col-md-6 col-lg-4" key={report.id}>
              <div className="card border-0 shadow-sm rounded-4 p-3 h-100 border-top border-success border-3">
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-0 text-capitalize">{report.itemName}</h5>
                    <small className="text-muted d-block">{report.market}, {report.city}</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success-subtle text-success d-block mb-1" style={{fontSize: '0.9rem'}}>
                        ₦{report.price?.toLocaleString()}
                    </span>
                    {report.isEdited && <small className="text-info d-block" style={{fontSize: '0.65rem'}}>Edited</small>}
                  </div>
                </div>

                <hr className="my-3 opacity-25" />
                
                <div className="d-flex justify-content-between align-items-center">
                  <div className="small text-muted">
                    {report.createdAt?.toDate() ? report.createdAt.toDate().toLocaleDateString() : "Just now"}
                  </div>
                  
                  <div className="btn-group">
                    <button className="btn btn-sm btn-outline-success  border-0 rounded-circle me-2" onClick={() => handleEdit(report.id, report.itemName, report.price)}>
                      ✏️
                    </button>
                    <button className="btn btn-sm btn-outline-dark border-0 py-2 rounded-circle" onClick={() => handleDelete(report.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="red"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 bg-white shadow-sm rounded-4 border">
          <p className="text-muted mb-0">No reports found for your account.</p>
          <a href="#/report" className="btn btn-link text-success fw-bold text-decoration-none mt-2">Create your first report ➔</a>
        </div>
      )}
    </div>
  );
};

export default MyReports;