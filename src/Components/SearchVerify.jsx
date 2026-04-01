import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore'; 
import { db } from '../firebase';
import { Link } from 'react-router-dom'; 

const SearchVerify = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // States for auto-suggestions
    const [allItems, setAllItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Fetch all item names for the auto-suggest list in real-time
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "current_prices"), (snapshot) => {
            setAllItems(snapshot.docs.map(doc => doc.id)); 
        });
        return () => unsubscribe();
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.trim().length > 0) {
            const filtered = allItems.filter(item => 
                item.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5)); // Show top 5 matches
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = async (e, selectedItem = null) => {
        if (e) e.preventDefault();
        
        const term = selectedItem || searchQuery;
        if (!term.trim()) return;

        setSuggestions([]); 
        setSearchQuery(term); 
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const formattedQuery = term.toLowerCase().trim();
            const docRef = doc(db, 'current_prices', formattedQuery);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                
                // Format the timestamp nicely
                const lastUpdated = data.updatedAt 
                    ? data.updatedAt.toDate().toLocaleString('en-NG', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) 
                    : "Recently";

                setResult({
                    name: term,
                    price: data.average_price,
                    market: data.last_reported_market,
                    city: data.last_reported_city,
                    state: data.last_reported_state, // Added State back
                    unit: data.last_reported_unit,
                    time: lastUpdated // Added exact time
                });
            } else {
                setError(`We don't have data for "${term}" yet. Be the first to report it!`);
            }
        } catch (err) {
            console.error(err);
            setError("Error searching. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5 py-5" style={{ borderTop: '1px solid #e2e8f0' }}>
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 text-center">
                    <h2 className="fw-bold mb-3">Verify a Market Price</h2>
                    <p className="text-muted mb-4">Search for an item to see its current market value.</p>
                    
                    <div className="position-relative mb-4">
                        <form onSubmit={(e) => handleSearch(e)} className="d-flex shadow-sm rounded-pill overflow-hidden" style={{ border: '2px solid #10b981' }}>
                            <input
                                type="text"
                                className="form-control border-0 shadow-none px-4 py-2"
                                placeholder="e.g., Petrol, Rice, Data..."
                                value={searchQuery}
                                onChange={handleInputChange} 
                                style={{ fontSize: '1.1rem' }}
                            />
                            <button 
                                type="submit" 
                                className="btn text-white px-4 px-md-5 fw-bold" 
                                style={{ backgroundColor: '#10b981', borderRadius: '0' }}
                                disabled={loading}
                            >
                                {loading ? 'Searching...' : 'Verify'}
                            </button>
                        </form>

                        {/* SUGGESTIONS DROPDOWN */}
                        {suggestions.length > 0 && (
                            <ul className="list-group position-absolute w-100 shadow-lg rounded-4 mt-2 text-start border-0" style={{ zIndex: 1000, overflow: 'hidden' }}>
                                {suggestions.map((item, index) => (
                                    <li 
                                        key={index} 
                                        className="list-group-item list-group-item-action text-capitalize py-3" 
                                        style={{ cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                                        onClick={() => handleSearch(null, item)}
                                    >
                                        <i className="bi bi-search text-muted me-2"></i> {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="alert alert-warning rounded-4 border-0 shadow-sm py-4">
                            <i className="bi bi-exclamation-circle text-warning fs-4 d-block mb-2"></i>
                            <span className="fw-medium">{error}</span> <br />
                            <Link to="/report" className="btn btn-dark btn-sm rounded-pill mt-3 px-4 fw-bold">
                                Report it Now ➔
                            </Link>
                        </div>
                    )}

                    {/* LOADING SPINNER */}
                    {loading && (
                        <div className="mt-5 text-success">
                            <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                            <p className="mt-3 fw-medium">Scanning MarketWatch Network...</p>
                        </div>
                    )}

                    {/* FULL DETAILS RESULT CARD */}
                    {result && !loading && (
                        <div className="card mt-5 border-0 shadow-lg rounded-4 overflow-hidden text-start" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                            <div className="card-header border-0 text-white py-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#0f172a' }}>
                                <div>
                                    <h4 className="mb-0 fw-bold text-capitalize d-flex align-items-center gap-2">
                                        <i className="bi bi-tag-fill text-success"></i> 
                                        {result.name}
                                    </h4>
                                </div>
                                {result.unit && (
                                    <span className="badge bg-light text-dark px-3 py-2 rounded-pill shadow-sm">
                                        Unit: {result.unit}
                                    </span>
                                )}
                            </div>
                            
                            <div className="card-body p-4 p-md-5 bg-white text-center">
                                <p className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Current Average Price</p>
                                <h1 className="display-3 fw-bold text-success mb-4">
                                    ₦{result.price?.toLocaleString()}
                                </h1>

                                {/* Detailed Breakdown Grid */}
                                <div className="row g-3 text-start">
                                    <div className="col-12 col-sm-6">
                                        <div className="p-3 rounded-3" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                            <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Market Location</small>
                                            <div className="fw-bold fs-5 text-dark mt-1 text-truncate">
                                                <i className="bi bi-shop text-success me-2"></i>
                                                {result.market}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="p-3 rounded-3" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                            <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>City & State</small>
                                            <div className="fw-bold fs-5 text-dark mt-1 text-truncate">
                                                <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                                                {result.city}, {result.state}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer bg-light border-0 py-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                                <p className="small text-muted mb-0 fw-medium">
                                    <i className="bi bi-check-circle-fill text-success me-1"></i> 
                                    Verified MarketWatch Data
                                </p>
                                <p className="small text-muted mb-0 fw-medium">
                                    <i className="bi bi-clock-history me-1"></i> 
                                    Reported: {result.time}
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SearchVerify;