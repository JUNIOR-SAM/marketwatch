import React, { useState, useEffect, useRef } from "react"; // ADDED: useRef
import { Link, useNavigate } from "react-router-dom"; 
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"; 
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../src/firebase"; 
import "../Css/Nav.css";

const Nav = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const [alertCount, setAlertCount] = useState(0);
    
    // NEW: Reference to the navbar to detect clicks outside
    const navRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                const lastTime = localStorage.getItem("lastLogoutTime") || new Date().toISOString();
                const q = query(
                    collection(db, "price_reports"),
                    where("createdAt", ">", new Date(lastTime))
                );
                const unsubAlerts = onSnapshot(q, (snapshot) => {
                    setAlertCount(snapshot.size);
                });
                return () => unsubAlerts();
            } else {
                setCurrentUser(null);
            }
        });

        // NEW: Logic to close the menu when clicking anywhere on the screen
        const handleClickOutside = (event) => {
            const navCollapse = document.getElementById("navbarNav");
            if (navRef.current && !navRef.current.contains(event.target)) {
                if (navCollapse.classList.contains("show")) {
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

    // NEW: Logic to close menu when a link is clicked
    const closeMenu = () => {
        const navCollapse = document.getElementById("navbarNav");
        if (navCollapse.classList.contains("show")) {
            navCollapse.classList.remove("show");
        }
    };

    const handleAlertClick = () => {
        closeMenu(); // ADDED: Close menu on alert click
        if (alertCount > 0) {
            localStorage.setItem("lastLogoutTime", new Date().toISOString());
            setAlertCount(0);
            navigate("/live-prices");
        }
    };

    const handleLogout = async () => {
        closeMenu(); // ADDED: Close menu on logout
        const confirmLogout = window.confirm("Are you sure you want to logout of MarketWatch?");
        if (confirmLogout) {
            try {
                localStorage.setItem("lastLogoutTime", new Date().toISOString());
                await signOut(auth);
                navigate("/signin"); 
            } catch (error) {
                console.error("Error logging out:", error.message);
            }
        }
    };

    return (
        <div className="nav-wrapper" ref={navRef}> {/* ADDED: ref here */}
            <nav className="navbar navbar-expand-lg custom-navbar py-2 px-3 px-lg-4">
                <div className="container-fluid p-0">
                    
                    <Link className="navbar-brand fw-bold" to="/dashboard" onClick={closeMenu}>
                        <span style={{ color: "#10b981" }}>Market</span>Watch
                    </Link>

                    <div className="d-flex align-items-center ms-auto order-lg-last">
                        <div className="d-lg-none position-relative me-3" onClick={handleAlertClick} style={{ cursor: 'pointer' }}>
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border shadow-sm" style={{ width: "40px", height: "40px" }}>
                                🔔
                            </div>
                            {alertCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '0.6rem' }}>
                                    {alertCount}
                                </span>
                            )}
                        </div>

                        <div className="ms-2 ms-lg-3">
                            {currentUser?.photoURL ? (
                                <img 
                                    src={currentUser.photoURL} 
                                    alt="Profile" 
                                    className="rounded-circle shadow-sm" 
                                    referrerPolicy="no-referrer"
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
                            {/* ADDED: onClick={closeMenu} to all links */}
                            <li className="nav-item"><Link className="nav-link" to="/dashboard" onClick={closeMenu}>Home</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/live-prices" onClick={closeMenu}>Market Terminal</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/report" onClick={closeMenu}>Report a Price</Link></li>

                            <li className="nav-item ms-lg-3 mt-3 mt-lg-0 pe-lg-3 position-relative d-none d-lg-block">
                                <button 
                                    onClick={handleAlertClick}
                                    className={`btn text-white rounded-pill px-4 shadow-sm w-100 w-lg-auto`}
                                    style={{ backgroundColor: "#10b981", cursor: alertCount > 0 ? "pointer" : "default", opacity: alertCount > 0 ? 1 : 0.7 }}
                                >
                                    Alerts
                                </button>
                                {alertCount > 0 && (
                                    <span className="position-absolute translate-middle badge rounded-pill bg-danger shadow" style={{ fontSize: '0.75rem', border: '2px solid white', zIndex: 10, left: '75%', marginTop: '7px' }}>
                                        {alertCount}
                                    </span>
                                )}
                            </li>

                            <li className="nav-item ms-lg-2 mt-3 mt-lg-0 mb-lg-0 mb-3">
                                <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill px-4 shadow-sm w-100 w-lg-auto">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Nav;