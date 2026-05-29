import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Aqui vai o @tailwind base; @tailwind components; @tailwind utilities;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
