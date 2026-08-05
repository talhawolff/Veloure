import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { VeloureLogo } from './VeloureLogo';
import { Menu, X, ArrowUpRight, Wallet, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'My Offers', path: '/offers' },
    { name: 'Propose Loan', path: '/propose' },
    { name: 'Active Loans', path: '/loans' },
    { name: 'Reputation', path: '/reputation' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FBF3E8]/90 backdrop-blur-md border-b border-[#332216]/10 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <VeloureLogo className="h-9 w-9 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-display font-bold text-2xl tracking-tight text-[#332216]">
              Veloure
            </span>
            <span className="text-[10px] font-sans tracking-widest text-[#8e4e20] uppercase font-semibold -mt-1">
              Arc Testnet
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-[#fff8f5]/80 p-1.5 rounded-full border border-[#332216]/10 shadow-sm">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all ${
                  active
                    ? 'bg-[#BE5103] text-white shadow-sm font-semibold'
                    : 'text-[#332216] hover:bg-[#ffe3d2]/60 hover:text-[#973e00]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Network Indicator & RainbowKit Connect Button */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6a5d36]/10 text-[#6a5d36] text-xs font-semibold border border-[#6a5d36]/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Arc Testnet
          </div>

          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus || authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="flex items-center gap-2 bg-[#BE5103] hover:bg-[#973e00] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                        >
                          <Wallet className="w-4 h-4" />
                          <span>Connect Wallet</span>
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-sm"
                        >
                          Wrong Network (Switch to Arc)
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="flex items-center gap-2 bg-[#fff8f5] hover:bg-[#ffe3d2] border border-[#332216]/15 text-[#332216] px-4 py-2 rounded-full text-sm font-medium shadow-xs transition-all"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#BE5103]" />
                          <span className="font-mono text-xs font-semibold">
                            {account.displayName}
                          </span>
                          {account.displayBalance ? (
                            <span className="text-xs text-[#8e4e20] pl-1 border-l border-[#332216]/10">
                              {account.displayBalance}
                            </span>
                          ) : null}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#332216] hover:bg-[#ffe3d2] rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#332216]/10 space-y-2 pb-3 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-[#BE5103] text-white font-semibold'
                  : 'text-[#332216] hover:bg-[#ffe3d2]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 px-2">
            <ConnectButton />
          </div>
        </div>
      )}
    </header>
  );
};
