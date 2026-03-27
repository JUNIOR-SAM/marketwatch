import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// 1. Bootstrap Core (CSS & JS)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

// 2. Bootstrap Icons (This fixes the "bi-megaphone" error)
import 'bootstrap-icons/font/bootstrap-icons.css';

// 3. Custom CSS 
// Since your CSS is in the 'src' folder now, this path is correct
import './index.css'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);