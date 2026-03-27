import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore'; // Added collection, onSnapshot
import { db } from '../src/firebase';
import { Link } from 'react-router-dom'; // Added Link

const SearchVerify = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // NEW: States for suggestions
    const [allItems, setAllItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // NEW: Fetch all item names for the auto-suggest list
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "current_prices"), (snapshot) => {
            setAllItems(snapshot.docs.map(doc => doc.id)); // doc.id is the lowercase item name
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

        setSuggestions([]); // Hide suggestions after clicking search
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const formattedQuery = term.toLowerCase().trim();
            const docRef = doc(db, 'current_prices', formattedQuery);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setResult({
                    name: term,
                    price: data.average_price,
                    market: data.last_reported_market,
                    city: data.last_reported_city
                });
            } else {
                setError(`We don't have data for "${term}" yet. Be the first to report it!`);
            }
        } catch (err) {
            setError("Error searching. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5 py-5" style={{ borderTop: '1px solid #e2e8f0' }}>
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 text-center">
                    <h2 className="fw-bold mb-3">Verify a Market Price</h2>
                    
                    <div className="position-relative mb-4">
                        <form onSubmit={(e) => handleSearch(e)} className="d-flex shadow-sm rounded-pill overflow-hidden" style={{ border: '2px solid #10b981' }}>
                            <input
                                type="text"
                                className="form-control border-0 shadow-none px-4 py-2"
                                placeholder="e.g., Petrol, Rice, Data..."
                                value={searchQuery}
                                onChange={handleInputChange} // Changed to handleInputChange
                                style={{ fontSize: '1.1rem' }}
                            />
                            <button type="submit" className="btn text-white px-5 fw-bold" style={{ backgroundColor: '#10b981', borderRadius: '0' }}>
                                Verify
                            </button>
                        </form>

                        {/* SUGGESTIONS DROPDOWN */}
                        {suggestions.length > 0 && (
                            <ul className="list-group position-absolute w-100 shadow-sm rounded-4 mt-1 text-start" style={{ zIndex: 1000 }}>
                                {suggestions.map((item, index) => (
                                    <li 
                                        key={index} 
                                        className="list-group-item list-group-item-action text-capitalize" 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setSearchQuery(item);
                                            handleSearch(null, item);
                                        }}
                                    >
                                        🔍 {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {error && (
                        <div className="alert alert-warning rounded-4 border-0 shadow-sm">
                            {error} <br />
                            <Link to="/report" className="fw-bold text-dark mt-2 d-inline-block">Go to Report Page ➔</Link>
                        </div>
                    )}

                    {/* ... (Result card remains the same as before) ... */}
                </div>
            </div>
        </div>
    );
};

export default SearchVerify;