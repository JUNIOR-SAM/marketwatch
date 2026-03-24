import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { getAuth, signOut } from "firebase/auth"; // Import Firebase Auth tools
import "../Css/Nav.css";

const Nav = () => {
    const navigate = useNavigate();
    const auth = getAuth();

    // The Logout Function
    const handleLogout = async () => {
        try {
            await signOut(auth);
            // After successful logout, send them to the sign-in page
            navigate("/signin"); 
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <div className="nav-wrapper">
            <nav className="navbar navbar-expand-lg custom-navbar">
                <div className="container-fluid">
                    {/* Brand Logo - Now links to Dashboard/Home */}
                    <Link
                        className="navbar-brand fw-bold"
                        to="/dashboard"
                        style={{ color: "#0f172a" }}
                    >
                        <span style={{ color: "#10b981" }}>Market</span>Watch
                    </Link>

                    {/* Mobile Toggle Button */}
                    <button
                        className="navbar-toggler border-0 shadow-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Nav Links */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/dashboard">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                {/* Fixed this to use Link for your new page */}
                                <Link className="nav-link" to="/live-prices">
                                    Market Terminal
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/report">
                                    Report a Price
                                </Link>
                            </li>

                            {/* Alerts Button */}
                            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                                <button
                                    className="btn text-white rounded-pill px-4 shadow-sm"
                                    style={{ backgroundColor: "#10b981" }}
                                >
                                    Alerts
                                </button>
                            </li>

                            {/* LOGOUT BUTTON - Red/Dark Outline for contrast */}
                            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline-danger rounded-pill px-4 shadow-sm"
                                >
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