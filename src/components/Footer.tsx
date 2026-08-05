import React from 'react';
import { Link } from 'react-router-dom';
import { VeloureLogo } from './VeloureLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#241C15] text-[#FAF6EF] py-8 px-6 lg:px-12 border-t border-[#332216]/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#C5B8AA] font-sans">
        {/* Left: Brand & Built by */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            <VeloureLogo className="h-6 w-6 text-white" />
            <span className="font-display font-bold text-lg text-white">Veloure</span>
          </div>
          <span className="hidden sm:inline text-[#FAF6EF]/30">•</span>
          <p className="text-[#C5B8AA]">
            Built by <span className="text-[#C8521A] font-semibold">Talha</span> • Arc Testnet
          </p>
        </div>

        {/* Center: Quick Links */}
        <div className="flex items-center gap-6 font-medium text-[#D1C4B5]">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <Link to="/offers" className="hover:text-white transition-colors">
            Documentation
          </Link>
          <Link to="/reputation" className="hover:text-white transition-colors">
            Terms
          </Link>
        </div>

        {/* Right: Disclaimer */}
        <div className="text-center md:text-right text-[11px] text-[#A29485]">
          Disclaimer: This is a testing environment.
        </div>
      </div>
    </footer>
  );
};

