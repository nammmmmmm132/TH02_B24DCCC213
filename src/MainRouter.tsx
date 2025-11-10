import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import các app con
import App from './components/Bai1';
import App1 from './components/Bai2';
import App2 from './components/Bai3';
import HomePage from './HomePage';

const MainRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/countries/*" element={<App />} />
        <Route path="/currency/*" element={<App1 />} />
        <Route path="/movies/*" element={<App2 />} />
      </Routes>
    </Router>
  );
};

export default MainRouter;
