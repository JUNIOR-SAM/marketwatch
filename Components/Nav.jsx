import React from "react";
import { Link } from "react-router-dom"; // Brings in the React Router Link tool
import "../Css/Nav.css";

const Nav = () => {
    return (
        <div className="nav-wrapper">
            <nav className="navbar navbar-expand-lg custom-navbar">
                <div className="container-fluid">
                    {/* Brand Logo - Links to Home */}
                    <Link
                        className="navbar-brand fw-bold"
                        to="/"
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
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Nav Links */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#prices-section">
                                    Live Prices
                                </a>{" "}
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/report">
                                    Report a Price
                                </Link>
                            </li>
                            {/* Call to Action Button */}
                            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                                <button
                                    className="btn text-white rounded-pill px-4 shadow-sm"
                                    style={{ backgroundColor: "#10b981" }}
                                >
                                    Alerts
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
