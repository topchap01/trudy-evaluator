import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// REMOVE index.css or tailwind.output.css
// Tailwind is now injected via CDN

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
