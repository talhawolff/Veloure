import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVeloureContract } from '../lib/useVeloureContract';
import { formatTokenAmount } from '../lib/formatters';
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileText,
  Gem,
  Zap,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { platformStats } = useVeloureContract();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqItems = [
    {
      q: 'How is a loan agreed upon?',
      a: 'A lender or borrower proposes initial terms (principal, interest rate in Bps, duration, token). The counterparty can accept directly or submit counter-proposals with updated terms on-chain until a mutual agreement is reached.',
    },
    {
      q: 'What happens if a loan isn\'t repaid on time?',
      a: 'If a loan passes its maturity date without full repayment, anyone can call markDefaulted on-chain. This permanently increments the borrower\'s defaulted count and impacts their public trust score across Arc Testnet.',
    },
    {
      q: 'Can I make partial repayments?',
      a: 'Yes, borrowers can submit partial ERC20 repayments towards their outstanding balance at any time before maturity. Each payment automatically reduces the remaining principal plus accrued interest.',
    },
    {
      q: 'Is my reputation history public?',
      a: 'Yes. All completed loans, repayment records, active debt obligations, and defaults are immutably logged on-chain, allowing any lender to verify borrower trustworthiness prior to offering credit.',
    },
  ];

  return (
    <div className="space-y-24 pb-16 pt-8 font-sans">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#332216] leading-[1.12]">
              Lending, <br />
              <span className="italic font-normal text-[#C8521A]">Negotiated Directly</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6E5C4E] max-w-xl font-sans leading-relaxed">
              Lenders and borrowers agree on terms together, on-chain, with full reputation history visible. No intermediaries, just direct agreements.
            </p>

            <div className="flex items-center gap-6 pt-2 text-sm font-medium">
              <Link
                to="/propose"
                className="text-[#332216] hover:text-[#C8521A] transition-colors underline underline-offset-4 decoration-[#332216]/30"
              >
                Offer a Loan
              </Link>
              <Link
                to="/offers"
                className="text-[#6E5C4E] hover:text-[#C8521A] transition-colors"
              >
                View My Offers
              </Link>
            </div>
          </motion.div>

          {/* Right Hero Visual: Circular Arc Ring Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center relative py-8"
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Concentric faint background rings */}
              <div className="absolute inset-0 rounded-full border border-[#C8521A]/10 animate-ping opacity-25" />
              <div className="absolute -inset-8 rounded-full border border-[#C8521A]/10" />
              <div className="absolute -inset-16 rounded-full border border-[#C8521A]/5" />
              <div className="absolute -inset-24 rounded-full border border-[#332216]/5" />

              {/* Main Outer Terracotta Ring */}
              <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                <circle
                  cx="100"
                  cy="100"
                  r="72"
                  stroke="#C8521A"
                  strokeWidth="18"
                  className="drop-shadow-xs"
                />
                {/* Left Dot */}
                <circle cx="28" cy="100" r="10" fill="#332216" />
                {/* Right Dot */}
                <circle cx="172" cy="100" r="10" fill="#332216" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Stats Bar */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="bg-[#FAF0E4]/60 rounded-2xl p-8 border border-[#332216]/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-display text-4xl sm:text-5xl font-bold text-[#C8521A]">
              &gt;${formatTokenAmount(platformStats.totalFunded, 0) || '12M'}
            </p>
            <p className="text-xs font-semibold text-[#8E7B6C] tracking-widest uppercase mt-2">
              Loans Funded
            </p>
          </div>
          <div>
            <p className="font-display text-4xl sm:text-5xl font-bold text-[#332216]">
              99.8%
            </p>
            <p className="text-xs font-semibold text-[#8E7B6C] tracking-widest uppercase mt-2">
              Total Repaid
            </p>
          </div>
          <div>
            <p className="font-display text-4xl sm:text-5xl font-bold text-[#332216]">
              {Number(platformStats.activeNegotiations || 432)}
            </p>
            <p className="text-xs font-semibold text-[#8E7B6C] tracking-widest uppercase mt-2">
              Active Negotiations
            </p>
          </div>
        </div>
      </section>

      {/* The Lending Lifecycle Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#332216]">
            The Lending Lifecycle
          </h2>
          <p className="text-[#6E5C4E] text-sm sm:text-base max-w-lg mx-auto">
            A transparent, step-by-step process designed for mutual agreement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Propose */}
          <div className="bg-[#FAF6EF] rounded-2xl p-6 border border-[#332216]/10 space-y-3 relative hover-lift">
            <div className="w-8 h-8 rounded-full bg-[#FAF0E4] border border-[#C8521A]/30 text-[#C8521A] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#332216]">
              1. Propose
            </h3>
            <p className="text-xs text-[#6E5C4E] leading-relaxed">
              Lender proposes terms directly to a chosen borrower.
            </p>
          </div>

          {/* Card 2: Negotiate */}
          <div className="bg-[#FAF6EF] rounded-2xl p-6 border border-[#332216]/10 space-y-3 relative hover-lift">
            <div className="w-8 h-8 rounded-full bg-[#FAF0E4] border border-[#C8521A]/30 text-[#C8521A] flex items-center justify-center">
              <Gem className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#332216]">
              2. Negotiate
            </h3>
            <p className="text-xs text-[#6E5C4E] leading-relaxed">
              Counter-offer until mutually beneficial terms are reached.
            </p>
          </div>

          {/* Card 3: Fund */}
          <div className="bg-[#FAF6EF] rounded-2xl p-6 border border-[#332216]/10 space-y-3 relative hover-lift">
            <div className="w-8 h-8 rounded-full bg-[#FAF0E4] border border-[#C8521A]/30 text-[#C8521A] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#332216]">
              3. Fund
            </h3>
            <p className="text-xs text-[#6E5C4E] leading-relaxed">
              Once agreed, smart contracts instantly execute the loan.
            </p>
          </div>

          {/* Card 4: Repay */}
          <div className="bg-[#FAF6EF] rounded-2xl p-6 border border-[#332216]/10 space-y-3 relative hover-lift">
            <div className="w-8 h-8 rounded-full bg-[#FAF0E4] border border-[#C8521A]/30 text-[#C8521A] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#332216]">
              4. Repay
            </h3>
            <p className="text-xs text-[#6E5C4E] leading-relaxed">
              Borrower repays, building their public on-chain reputation.
            </p>
          </div>
        </div>
      </section>

      {/* Targeted P2P Lending & Reputation Core Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8" id="about-section">
        {/* Left Card: Targeted P2P Lending */}
        <div className="bg-[#FAF0E4]/70 rounded-3xl p-8 sm:p-10 border border-[#332216]/10 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold text-[#332216]">
              Targeted P2P Lending
            </h2>
            <p className="text-sm text-[#6E5C4E] leading-relaxed font-sans">
              Veloure is targeted peer-to-peer lending — a lender chooses a specific borrower, proposes terms, and either party can counter-offer until they agree.
            </p>
          </div>

          <div className="pl-4 border-l-2 border-[#C8521A] text-xs text-[#332216] font-medium leading-relaxed">
            There is no forced collateral and no open loan pool.
          </div>
        </div>

        {/* Right Card: Reputation Core */}
        <div className="bg-[#FAF0E4]/70 rounded-3xl p-8 sm:p-10 border border-[#332216]/10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl font-bold text-[#332216]">
              Reputation Core
            </h2>
            <div className="w-7 h-7 rounded-full bg-[#C8521A]/10 text-[#C8521A] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          <p className="text-xs text-[#6E5C4E] leading-relaxed font-sans">
            All history is visible on-chain, creating a trustless environment based on verifiable past actions.
          </p>

          <div className="space-y-3 pt-2">
            <div className="bg-white/80 rounded-xl p-4 flex items-center justify-between text-xs border border-[#332216]/5">
              <span className="font-medium text-[#6E5C4E]">Loans Repaid</span>
              <span className="font-display font-bold text-base text-[#332216]">12</span>
            </div>

            <div className="bg-white/80 rounded-xl p-4 flex items-center justify-between text-xs border border-[#332216]/5">
              <span className="font-medium text-[#6E5C4E]">Active Loans</span>
              <span className="font-display font-bold text-base text-[#C8521A]">2</span>
            </div>

            <div className="bg-white/80 rounded-xl p-4 flex items-center justify-between text-xs border border-[#332216]/5">
              <span className="font-medium text-[#6E5C4E]">Defaulted</span>
              <span className="font-display font-bold text-base text-[#332216]">0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="bg-[#423C28] text-[#FAF6EF] rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#363120] rounded-xl overflow-hidden transition-colors border border-white/5"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-sans font-medium text-sm sm:text-base text-white/90 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#C8521A] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/50 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#D1C8BC] leading-relaxed border-t border-white/5 font-sans">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

