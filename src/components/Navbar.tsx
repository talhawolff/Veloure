import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { VeloureLogo } from './VeloureLogo';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6EF]/90 backdrop-blur-md px-6 lg:px-12 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-md bg-[#FAF0E4] border border-[#332216]/10 flex items-center justify-center p-1 shadow-xs">
            <VeloureLogo className="h-7 w-7 transition-transform group-hover:scale-105" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-[#332216]">
            Veloure
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-sans font-medium text-[#554436]">
          <Link
            to="/propose"
            className="hover:text-[#BE5103] transition-colors"
          >
            Lend
          </Link>
          <Link
            to="/offers"
            className="hover:text-[#BE5103] transition-colors"
          >
            Negotiate
          </Link>
          <Link
            to="/reputation"
            className="hover:text-[#BE5103] transition-colors"
          >
            Reputation
          </Link>
          <button
            onClick={() => handleScrollToSection('about-section')}
            className="hover:text-[#BE5103] transition-colors cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right: Connect Wallet / Launch App button */}
        <div className="hidden sm:flex items-center gap-3">
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
                          className="bg-[#FAF0E4] hover:bg-[#F2E4D2] text-[#332216] border border-[#332216]/15 px-6 py-2 rounded-full text-xs font-semibold tracking-wide transition-all shadow-2xs hover:shadow-xs active:scale-95"
                        >
                          Launch App
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-full text-xs font-semibold shadow-xs"
                        >
                          Switch Network
                        </button>
                      );
                    }

                    return (
                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="bg-[#FAF0E4] hover:bg-[#F2E4D2] border border-[#332216]/15 text-[#332216] px-5 py-2 rounded-full text-xs font-mono font-semibold transition-all shadow-2xs"
                      >
                        {account.displayName}
                      </button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#332216] hover:bg-[#FAF0E4] rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#332216]/10 space-y-3 pb-3">
          <Link
            to="/propose"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-lg text-sm font-medium text-[#332216] hover:bg-[#FAF0E4]"
          >
            Lend
          </Link>
          <Link
            to="/offers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-lg text-sm font-medium text-[#332216] hover:bg-[#FAF0E4]"
          >
            Negotiate
          </Link>
          <Link
            to="/reputation"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-lg text-sm font-medium text-[#332216] hover:bg-[#FAF0E4]"
          >
            Reputation
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleScrollToSection('about-section');
            }}
            className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-[#332216] hover:bg-[#FAF0E4]"
          >
            About
          </button>
          <div className="pt-2 px-2">
            <ConnectButton />
          </div>
        </div>
      )}
    </header>
  );
};

