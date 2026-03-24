import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// 1. Bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

// 2. Custom CSS (Keep this below Bootstrap so your custom styles win)
import './index.css'; 

// 3. The single, correct render function
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);