import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../firebase";

const MarketTerminal = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Setup the query to get the latest 50 reports
        const q = query(
            collection(db, "price_reports"),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        // 2. Listen for real-time updates
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reportsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReports(reportsData);
            setLoading(false);

            // 3. Clear the alert badge locally once they see the data
            localStorage.setItem("lastLogoutTime", new Date().toISOString());
        });

        return () => unsubscribe();
    }, []);

    // Helper function to safely format the time
    const formatTime = (timestamp) => {
        if (!timestamp) return "Just now";
        return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        // Using the standard container to match the Navbar's exact width
        <div className="container mt-5 pt-4 mb-5">
            
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-end mb-4 px-2">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Live Market Terminal</h2>
                    <p className="text-muted small mb-0 d-none d-md-block">Real-time price updates from across the network</p>
                </div>
                <span className="badge bg-success bg-opacity-10 text-success border border-success rounded-pill px-3 py-2 fw-medium shadow-sm d-flex align-items-center gap-2">
                    <span className="spinner-grow spinner-grow-sm text-success" role="status" style={{ width: '0.5rem', height: '0.5rem' }}></span>
                    Live Feed
                </span>
            </div>

            {/* Terminal Card - Now stretches 100% of the container */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-secondary text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                            <tr>
                                <th className="ps-4 py-3 border-0">Item & Unit</th>
                                <th className="py-3 border-0">Price</th>
                                <th className="py-3 border-0">Location (Market)</th>
                                <th className="py-3 border-0 d-none d-md-table-cell text-end pe-4">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                                        Connecting to MarketWatch Network...
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                                        No reports found yet. Be the first to report!
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} style={{ transition: 'all 0.2s ease' }}>
                                        
                                        {/* Column 1: Item and Unit (Description) */}
                                        <td className="ps-4 py-3">
                                            <div className="fw-bold text-dark text-capitalize fs-6">
                                                {report.itemName}
                                            </div>
                                            {/* Displaying the description/unit right under the item name */}
                                            {report.description && (
                                                <span className="badge bg-light border text-secondary mt-1 fw-normal" style={{ fontSize: '0.75rem' }}>
                                                    {report.description}
                                                </span>
                                            )}
                                        </td>
                                        
                                        {/* Column 2: Price */}
                                        <td className="py-3">
                                            <span className="text-success fw-bold fs-5">
                                                ₦{report.price?.toLocaleString()}
                                            </span>
                                        </td>
                                        
                                        {/* Column 3: Location (Responsive layout) */}
                                        <td className="py-3">
                                            <div className="fw-medium text-dark d-flex align-items-center gap-1">
                                                <i className="bi bi-shop text-muted d-none d-md-inline"></i> 
                                                {report.market}
                                            </div>
                                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                {report.city}, {report.state}
                                            </div>
                                            {/* Mobile Time: Show time here on small screens */}
                                            <div className="text-muted d-md-none mt-1" style={{ fontSize: '0.75rem' }}>
                                                <i className="bi bi-clock me-1"></i>
                                                {formatTime(report.createdAt)}
                                            </div>
                                        </td>
                                        
                                        {/* Column 4: Time (Hidden on Mobile, shown on Desktop) */}
                                        <td className="py-3 text-end pe-4 d-none d-md-table-cell text-muted" style={{ fontSize: '0.9rem' }}>
                                            {formatTime(report.createdAt)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MarketTerminal;