import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// 1. Bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

// 2. Custom CSS (Update this path if index.css is inside your Css folder)
// If index.css is just in 'src', leave as is. If it's in 'src/Css', use './Css/index.css'
import './index.css'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);