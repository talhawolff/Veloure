import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Offers } from './pages/Offers';
import { ProposeLoan } from './pages/ProposeLoan';
import { ActiveLoans } from './pages/ActiveLoans';
import { ReputationProfile } from './pages/ReputationProfile';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF3E8] text-[#332216]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/propose" element={<ProposeLoan />} />
          <Route path="/loans" element={<ActiveLoans />} />
          <Route path="/reputation" element={<ReputationProfile />} />
          <Route path="/reputation/:address" element={<ReputationProfile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

