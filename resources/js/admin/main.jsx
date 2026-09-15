import React from 'react';
import ReactDOM from 'react-dom/client';
import AppAdmin from './AppAdmin';
import './utils/apiClient'; // sets window.apiClient
import './index.css';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <AppAdmin />
  </React.StrictMode>
);
