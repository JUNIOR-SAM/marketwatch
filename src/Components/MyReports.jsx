import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { db } from '../firebase';
import { nigeriaStates } from '../Data/nigeria'; 

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingReport, setEditingReport] = useState(null); 
  const [deletingReportId, setDeletingReportId] = useState(null);
  
  // NEW: State for the success notification
  const [successMessage, setSuccessMessage] = useState(''); 

  const auth = getAuth();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const myName = user.displayName || user.email.split('@')[0];
        
        const q = query(
          collection(db, "price_reports"),
          where("userName", "==", myName)
        );

        const unsubscribeSnap = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
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

  // --- EDIT LOGIC ---
  const openEditModal = (report) => {
    setEditingReport({ ...report });
  };

  const handleEditChange = (field, value) => {
    setEditingReport(prev => ({ ...prev, [field]: value }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingReport.price || !editingReport.market || !editingReport.city || !editingReport.state) return;

    try {
      // 1. Update the historical report
      const reportRef = doc(db, "price_reports", editingReport.id);
      await updateDoc(reportRef, {
        price: Number(editingReport.price),
        market: editingReport.market,
        state: editingReport.state, 
        city: editingReport.city,
        createdAt: serverTimestamp(), 
        isEdited: true
      });

      // 2. Update the main search dictionary
      const itemRef = doc(db, "current_prices", editingReport.itemName.toLowerCase());
      await updateDoc(itemRef, {
        average_price: Number(editingReport.price),
        last_reported_market: editingReport.market,
        last_reported_state: editingReport.state, 
        last_reported_city: editingReport.city,
        updatedAt: serverTimestamp()
      });

      setEditingReport(null); // Close the modal
      
      // NEW: Trigger the success message and hide it after 3.5 seconds
      setSuccessMessage(`Successfully updated ${editingReport.itemName}!`);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3500);

    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update report. Please try again.");
    }
  };

  // --- DELETE LOGIC ---
  const openDeleteModal = (id) => {
    setDeletingReportId(id);
  };

  const confirmDelete = async () => {
    if (deletingReportId) {
      try {
        await deleteDoc(doc(db, "price_reports", deletingReportId));
        setDeletingReportId(null); 
        
        // NEW: Trigger a delete success message too!
        setSuccessMessage('Report permanently deleted.');
        setTimeout(() => setSuccessMessage(''), 3500);

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
    <div className="container mt-5 pt-4 px-4 mb-5 position-relative">
      
      {/* NEW: Floating Success Notification */}
      {successMessage && (
        <div className="alert alert-success shadow-sm border-0 rounded-pill text-center fw-medium mx-auto position-sticky top-0 z-3" 
             style={{ backgroundColor: '#d1fae5', color: '#065f46', maxWidth: '500px', animation: 'fadeInDown 0.4s ease-out' }}>
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMessage}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
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
                    <small className="text-muted d-block">{report.market}</small>
                    <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>{report.city}, {report.state}</small>
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
                    <button className="btn btn-sm btn-outline-light border-0 rounded-circle me-2" onClick={() => openEditModal(report)}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="green"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                    </button>
                    <button className="btn btn-sm btn-outline-dark border-0 py-2 rounded-circle" onClick={() => openDeleteModal(report.id)}>
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

      {/* 1. EDIT MODAL */}
      {editingReport && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050, backdropFilter: 'blur(3px)' }}>
          <div className="card border-0 shadow-lg p-4 p-md-5 rounded-4" style={{ maxWidth: '500px', width: '90%' }}>
            <h4 className="fw-bold mb-3 text-capitalize">Edit {editingReport.itemName}</h4>
            <form onSubmit={submitEdit}>
              
              <div className="mb-3">
                <label className="form-label small fw-bold">Price (₦)</label>
                <input 
                  type="number" 
                  className="form-control bg-light border-0 py-2 text-success fw-bold" 
                  value={editingReport.price} 
                  onChange={(e) => handleEditChange('price', e.target.value)} 
                  required 
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label small fw-bold">State</label>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    value={editingReport.state || ''} 
                    onChange={(e) => {
                      handleEditChange('state', e.target.value);
                      handleEditChange('city', ''); 
                    }} 
                    required
                  >
                    <option value="" disabled hidden>Choose State</option>
                    {Object.keys(nigeriaStates).sort().map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="col-sm-6">
                  <label className="form-label small fw-bold">City/LGA</label>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    value={editingReport.city || ''} 
                    onChange={(e) => handleEditChange('city', e.target.value)} 
                    required 
                    disabled={!editingReport.state}
                  >
                    <option value="" disabled hidden>{editingReport.state ? "Select City" : "Pick State"}</option>
                    {editingReport.state && nigeriaStates[editingReport.state].sort().map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Market Name</label>
                <input 
                  type="text" 
                  className="form-control bg-light border-0 py-2" 
                  value={editingReport.market} 
                  onChange={(e) => handleEditChange('market', e.target.value)} 
                  required 
                />
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light w-50 fw-bold rounded-pill" onClick={() => setEditingReport(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success w-50 fw-bold rounded-pill">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. DELETE CONFIRMATION MODAL */}
      {deletingReportId && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050, backdropFilter: 'blur(3px)' }}>
          <div className="card border-0 shadow-lg p-4 rounded-4 text-center" style={{ maxWidth: '350px', width: '90%' }}>
            <div className="mb-3 text-danger">
              <i className="bi bi-exclamation-circle-fill" style={{ fontSize: '3rem' }}></i>
            </div>
            <h4 className="fw-bold mb-2">Delete Report?</h4>
            <p className="text-muted small mb-4">Are you sure you want to delete this price report? This action cannot be undone.</p>
            
            <div className="d-flex gap-3 justify-content-center">
              <button className="btn btn-light fw-bold px-4 rounded-pill" onClick={() => setDeletingReportId(null)}>
                No, Keep it
              </button>
              <button className="btn btn-danger fw-bold px-4 rounded-pill" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyReports;