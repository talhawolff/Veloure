import React from 'react';
import { Link } from 'react-router-dom';
import { VeloureLogo } from './VeloureLogo';
import { ExternalLink, Heart, Shield, Code2, Sparkles } from 'lucide-react';
import { VELOURE_CONTRACT_ADDRESS } from '../config/contracts';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#332216] text-[#FBF3E8] pt-14 pb-8 px-4 lg:px-8 mt-24 border-t-4 border-[#BE5103]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-[#FBF3E8]/10 pb-12">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <VeloureLogo className="h-10 w-10 text-white" />
              <span className="font-display font-bold text-3xl tracking-tight text-[#FBF3E8]">
                Veloure
              </span>
            </div>
            <p className="text-sm text-[#FBF3E8]/80 max-w-md leading-relaxed font-sans">
              Peer-to-peer reputation-based lending platform deployed on Arc Testnet. Negotiate bilateral custom interest rates, loan durations, and build uncollateralized credit trust directly on-chain.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BE5103]/20 border border-[#BE5103]/40 text-[#ffe3d2] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Arc Testnet Connected
              </span>
              <a
                href={`https://testnet.arcscan.app/address/${VELOURE_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#FBF3E8]/70 hover:text-[#BE5103] transition-colors"
              >
                Contract Explorer <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-lg text-[#ffe3d2]">Platform</h4>
            <ul className="space-y-2 text-sm text-[#FBF3E8]/80 font-sans">
              <li>
                <Link to="/" className="hover:text-[#BE5103] transition-colors">
                  Overview & Stats
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#BE5103] transition-colors">
                  Negotiations & Offers
                </Link>
              </li>
              <li>
                <Link to="/propose" className="hover:text-[#BE5103] transition-colors">
                  Propose Loan Offer
                </Link>
              </li>
              <li>
                <Link to="/loans" className="hover:text-[#BE5103] transition-colors">
                  Active Loans & Repayments
                </Link>
              </li>
              <li>
                <Link to="/reputation" className="hover:text-[#BE5103] transition-colors">
                  Reputation Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Network & Resources */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-lg text-[#ffe3d2]">Resources</h4>
            <ul className="space-y-2 text-sm text-[#FBF3E8]/80 font-sans">
              <li>
                <a
                  href="https://rpc.testnet.arc.network"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#BE5103] transition-colors flex items-center gap-1"
                >
                  Arc RPC Endpoint <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://testnet.arcscan.app"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#BE5103] transition-colors flex items-center gap-1"
                >
                  ArcScan Explorer <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#BE5103] transition-colors"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#BE5103] transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#FBF3E8]/60">
          {/* Prominent Built by Talha attribution with Burnt-Orange Glow */}
          <div className="flex items-center gap-2 group cursor-default">
            <Sparkles className="w-4 h-4 text-[#BE5103] group-hover:rotate-12 transition-transform" />
            <span className="font-display text-sm tracking-wide text-[#FBF3E8]">
              Designed & Built by{' '}
              <span className="font-bold text-[#BE5103] burnt-orange-glow group-hover:text-[#ff781e] transition-all underline decoration-[#BE5103]/40 underline-offset-4">
                Talha
              </span>
            </span>
          </div>

          {/* Arc Testnet Disclaimer */}
          <p className="text-center md:text-right text-xs max-w-md text-[#FBF3E8]/50">
            Veloure is an independent peer-to-peer lending project built on Arc Testnet.
            Transactions use test tokens (USDC/EURC) on Chain ID 5042002.
          </p>
        </div>
      </div>
    </footer>
  );
};
