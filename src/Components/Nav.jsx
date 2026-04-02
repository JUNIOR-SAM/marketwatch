import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"; 
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../firebase"; 
import "../Css/Nav.css";

const Nav = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const [alertCount, setAlertCount] = useState(0);
    const navRef = useRef(null);
    
    // NEW: State to control the Logout Modal
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                
                // 1. Listen for the latest 20 reports
                const q = query(
                    collection(db, "price_reports"),
                    orderBy("createdAt", "desc"),
                    limit(20)
                );

                const unsubAlerts = onSnapshot(q, (snapshot) => {
                    // 2. Get the last time the user "cleared" their alerts
                    const lastChecked = parseInt(localStorage.getItem("lastCheckedAlerts") || "0");
                    const myName = user.displayName || user.email.split('@')[0];

                    // 3. Filter: Only count if NEW and NOT reported by ME
                    const newAlerts = snapshot.docs.filter(doc => {
                        const data = doc.data();
                        const reportTime = data.createdAt?.toMillis() || 0;
                        return reportTime > lastChecked && data.userName !== myName;
                    });

                    setAlertCount(newAlerts.length);
                });
                return () => unsubAlerts();
            } else {
                setCurrentUser(null);
            }
        });

        const handleClickOutside = (event) => {
            const navCollapse = document.getElementById("navbarNav");
            if (navRef.current && !navRef.current.contains(event.target)) {
                if (navCollapse?.classList.contains("show")) {
                    navCollapse.classList.remove("show");
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            unsubscribe();
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [auth]);

    const closeMenu = () => {
        const navCollapse = document.getElementById("navbarNav");
        if (navCollapse?.classList.contains("show")) {
            navCollapse.classList.remove("show");
        }
    };

    const handleAlertClick = () => {
        if (alertCount <= 0) return;

        closeMenu();
        // Save current time as "last checked"
        localStorage.setItem("lastCheckedAlerts", Date.now().toString());
        setAlertCount(0);
        navigate("/live-prices");
    };

    // NEW: Function just to open the modal
    const handleLogoutClick = () => {
        closeMenu();
        setShowLogoutModal(true);
    };

    // NEW: Function that actually performs the Firebase logout
    const confirmLogout = async () => {
        try {
            // Clear alerts for the next session
            localStorage.setItem("lastCheckedAlerts", Date.now().toString());
            await signOut(auth);
            setShowLogoutModal(false); // Close modal
            navigate("/signin"); 
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <div className="nav-wrapper" ref={navRef}>
            <nav className="navbar navbar-expand-lg custom-navbar py-2 px-3 px-lg-4">
                <div className="container-fluid p-0">
                    
                    <Link className="navbar-brand fw-bold" to="/dashboard" onClick={closeMenu}>
                        <span style={{ color: "#10b981" }}>Market</span>Watch
                    </Link>

                    <div className="d-flex align-items-center ms-auto order-lg-last">
                        {/* MOBILE ALERT ICON - Dimmed if 0 */}
                        <div 
                            className="d-lg-none position-relative me-1" 
                            onClick={handleAlertClick} 
                            style={{ 
                                cursor: alertCount > 0 ? 'pointer' : 'default',
                                opacity: alertCount > 0 ? 1 : 0.5 
                            }}
                        >
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border border-success border-2 shadow-sm" style={{ width: "40px", height: "40px" }}>
                                🔔
                            </div>
                            {alertCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white " style={{ fontSize: '0.8rem',width: "25px", height: "25px",left: '75%', marginTop: '10px' }}>
                                    {alertCount}
                                </span>
                            )}
                        </div>

                        <div className="ms-2 ms-lg-3">
                            {currentUser?.photoURL ? (
                                <img 
                                    src={currentUser.photoURL} 
                                    alt="P" 
                                    className="rounded-circle shadow-sm" 
                                    style={{ width: "40px", height: "40px", border: "2px solid #10b981", objectFit: "cover" }} 
                                />
                            ) : (
                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-muted border shadow-sm" style={{ width: "40px", height: "40px" }}>
                                    {currentUser ? "👤" : ""}
                                </div>
                            )}
                        </div>

                        <button className="navbar-toggler border-0 shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center mt-3 mt-lg-0">
                            <li className="nav-item"><Link className="nav-link" to="/dashboard" onClick={closeMenu}>Home</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/live-prices" onClick={closeMenu}>Market Terminal</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/report" onClick={closeMenu}>Report a Price</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/my-reports" onClick={closeMenu}>My History</Link></li>
                            
                            {/* DESKTOP ALERT BUTTON - Disabled and faded if 0 */}
                            <li className="nav-item ms-lg-3 mt-3 mt-lg-0 pe-lg-3 position-relative d-none d-lg-block">
                                <button 
                                    onClick={handleAlertClick}
                                    disabled={alertCount === 0}
                                    className="btn text-white rounded-pill px-4 shadow-sm w-100 w-lg-auto"
                                    style={{ 
                                        backgroundColor: "#10b981", 
                                        opacity: alertCount > 0 ? 1 : 0.4,
                                        cursor: alertCount > 0 ? "pointer" : "not-allowed" 
                                    }}
                                >
                                    Alerts
                                </button>
                                {alertCount > 0 && (
                                    <span className="position-absolute translate-middle badge rounded-pill bg-danger shadow" style={{ fontSize: '0.75rem', border: '2px solid white', zIndex: 10, left: '75%', marginTop: '10px' }}>
                                        {alertCount}
                                    </span>
                                )}
                            </li>

                            <li className="nav-item ms-lg-2 mt-3 mt-lg-0 mb-lg-0 mb-3">
                                {/* UPDATED: This now triggers the custom modal instead of window.confirm */}
                                <button onClick={handleLogoutClick} className="btn btn-outline-danger rounded-pill px-4 shadow-sm w-100 w-lg-auto">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* =========================================
                LOGOUT CONFIRMATION MODAL
                ========================================= */}
            {showLogoutModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050, backdropFilter: 'blur(3px)' }}>
                    <div className="card border-0 shadow-lg p-4 rounded-4 text-center" style={{ maxWidth: '350px', width: '90%' }}>
                        <div className="mb-3 text-danger">
                            {/* Uses a cool "door exit" icon to represent logging out */}
                            <i className="bi bi-box-arrow-right" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h4 className="fw-bold mb-2">Ready to leave?</h4>
                        <p className="text-muted small mb-4">Are you sure you want to log out of your MarketWatch account?</p>
                        
                        <div className="d-flex gap-3 justify-content-center">
                            <button className="btn btn-light fw-bold px-4 rounded-pill" onClick={() => setShowLogoutModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-danger fw-bold px-4 rounded-pill" onClick={confirmLogout}>
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Nav;