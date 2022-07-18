import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import './api/axios';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
