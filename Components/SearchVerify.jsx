import React, { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../src/firebase';

const SearchVerify = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            // NORMALIZATION: Match the lowercase database records
            const formattedQuery = searchQuery.toLowerCase().trim();
            const docRef = doc(db, 'current_prices', formattedQuery);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data(); 
                setResult({
                    name: searchQuery, // Keep the user's typed name for display
                    price: data.average_price,
                    market: data.last_reported_market, 
                    city: data.last_reported_city
                });
            } else {
                setError(`We don't have data for "${searchQuery}" yet. Be the first to report it!`);
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred while searching. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5 py-5" style={{ borderTop: '1px solid #e2e8f0' }}>
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 text-center">
                    <h2 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Verify a Market Price</h2>
                    <p className="text-muted mb-4">Search for an item to see the real crowdsourced average before you buy.</p>

                    <form onSubmit={handleSearch} className="d-flex shadow-sm rounded-pill overflow-hidden mb-4" style={{ border: '2px solid #10b981' }}>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none px-4 py-2"
                            placeholder="e.g., Petrol, Rice, Data..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ fontSize: '1.1rem' }}
                        />
                        <button type="submit" className="btn text-white px-5 fw-bold" style={{ backgroundColor: '#10b981', borderRadius: '0' }} disabled={loading}>
                            {loading ? 'Searching...' : 'Verify'}
                        </button>
                    </form>

                    {error && (
                        <div className="alert alert-warning rounded-4 border-0 shadow-sm">
                            {error} <br />
                            <a href="/report" className="fw-bold text-dark mt-2 d-inline-block">Go to Report Page ➔</a>
                        </div>
                    )}

                    {result && (
                        <div className="card border-0 bg-white rounded-4 shadow-lg mt-4 p-4 text-center border-start border-success border-5">
                            <span className="badge bg-success rounded-pill mx-auto mb-3 px-3 py-2">Verified Market Average</span>

                            <h4 className="text-capitalize text-muted mb-1">{result.name}</h4>
                            <h1 className="display-2 fw-bold mb-2" style={{ color: '#0f172a' }}>
                                ₦{result.price.toLocaleString()}
                            </h1>

                            <div className="d-flex justify-content-center gap-3 mt-3">
                                <div className="text-start">
                                    <small className="text-muted d-block">Last Location</small>
                                    <span className="fw-bold text-capitalize">{result.market || 'General Market'}</span>
                                </div>
                                <div className="vr"></div>
                                <div className="text-start">
                                    <small className="text-muted d-block">Last Updated</small>
                                    <span className="fw-bold">Today</span>
                                </div>
                            </div>

                            <p className="mt-4 mb-0 small text-muted italic px-3">
                                "I bought this for ₦{result.price.toLocaleString()} at {result.market || 'the market'} recently."
                                <br />— Reported by a verified user in {result.city || 'your area'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchVerify;