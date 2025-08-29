
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BillPage from './pages/BillPage';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bill/:billId" element={<BillPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </main>
    </div>
  );
};

export default App;