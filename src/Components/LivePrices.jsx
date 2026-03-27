import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../firebase";
import "../Css/MarketTerminal.css"; // Make sure to create this CSS file!

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

    return (
        <div className="container mt-5 pt-4 ">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Live Market Terminal</h2>
                <span className="badge bg-success pulse-animation">● Live Feed</span>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Item</th>
                                <th>Price</th>
                                <th>Location (Market)</th>
                                <th>Time Reported</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-5">Connecting to MarketWatch Network...</td></tr>
                            ) : reports.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-5">No reports found yet. Be the first to report!</td></tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="fade-in-row">
                                        <td className="ps-4 fw-bold text-capitalize">{report.itemName}</td>
                                        <td className="text-success fw-bold">₦{report.price?.toLocaleString()}</td>
                                        <td>
                                            <div className="small fw-medium">{report.market}</div>
                                            <div className="text-muted smaller">{report.city}, {report.state}</div>
                                        </td>
                                        <td className="text-">
                                            {report.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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