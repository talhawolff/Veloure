import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVeloureContract } from '../lib/useVeloureContract';
import { formatTokenAmount, getTrustScore } from '../lib/formatters';
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Percent,
  CheckCircle2,
  AlertCircle,
  Zap,
  Lock,
  Coins,
  Globe,
  FileCheck,
  Building2,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { platformStats, localOffers, localLoans } = useVeloureContract();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqItems = [
    {
      q: 'How does Veloure peer-to-peer negotiation work?',
      a: 'Either a borrower or lender creates a proposal specifying asset (USDC or EURC), principal amount, interest rate, and duration. The counterparty can accept directly or submit a counter-proposal with modified terms in an on-chain negotiation chain until both parties agree.',
    },
    {
      q: 'What is Arc Testnet and why is Veloure built on it?',
      a: 'Arc Testnet is a high-performance EVM-compatible layer built for fast finality and micro-gas fees. This allows Veloure users to submit counter-offers, approve repayments, and update reputation records instantaneously without prohibitive gas costs.',
    },
    {
      q: 'Is collateral required for loans on Veloure?',
      a: 'Veloure introduces reputation-based credit. While lenders can evaluate borrower reputation scores, active loans, and default history before funding, terms are custom-agreed directly between borrower and lender without algorithmically enforced liquidation ratios.',
    },
    {
      q: 'How are interest rates and loan durations calculated?',
      a: 'Interest rates are defined in Basis Points (Bps), where 100 Bps = 1.00%. For example, a 500 Bps rate on a 10,000 USDC principal results in 10,500 USDC total owed upon completion.',
    },
    {
      q: 'What happens if a borrower defaults on a loan?',
      a: 'If a loan passes its due date without full repayment, anyone can execute `markDefaulted(loanId)`. This permanently increments the borrower default counter on-chain, lowering their trust rating across the Arc ecosystem.',
    },
  ];

  const roadmapPhases = [
    {
      phase: 'Phase 1',
      title: 'Arc Testnet Core Deployment',
      status: 'Live on Arc Testnet',
      statusBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Deploy peer-to-peer loan factory, offer counter-negotiation engine, reputation tracking, and ERC20 approval mechanisms on Arc Testnet.',
    },
    {
      phase: 'Phase 2',
      title: 'Credit Score Oracles & ENS Identity',
      status: 'In Progress',
      statusBg: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Integrate multi-chain credit history oracles and ENS reverse resolution to enrich borrower reputation profiles with off-chain and cross-chain metrics.',
    },
    {
      phase: 'Phase 3',
      title: 'Syndicated Multi-Lender Pools',
      status: 'Upcoming',
      statusBg: 'bg-[#6a5d36]/10 text-[#6a5d36] border-[#6a5d36]/20',
      description: 'Allow multiple lenders to co-fund larger loan proposals through fractionalized debt tranche tokens.',
    },
    {
      phase: 'Phase 4',
      title: 'Cross-Chain Arc Liquidity Bridge',
      status: 'Planned',
      statusBg: 'bg-[#332216]/10 text-[#332216] border-[#332216]/20',
      description: 'Enable seamless cross-chain collateral and settlement bridging directly from Ethereum mainnet and Arbitrum to Arc Testnet.',
    },
    {
      phase: 'Phase 5',
      title: 'Veloure DAO & Governance',
      status: 'Planned',
      statusBg: 'bg-[#332216]/10 text-[#332216] border-[#332216]/20',
      description: 'Transition protocol parameter updates, insurance pool management, and fee distributions to $VELOURE token holders.',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BE5103]/10 border border-[#BE5103]/30 text-[#BE5103] text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-[#BE5103]" />
            Deployed on Arc Testnet • Chain ID 5042002
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#332216] leading-[1.1]">
            Lending, <span className="italic text-[#BE5103] font-normal">Negotiated Directly</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#8e4e20] max-w-2xl mx-auto font-sans leading-relaxed">
            The peer-to-peer reputation lending protocol on Arc Testnet. Propose custom loan terms, counter-negotiate bilaterally, and build uncollateralized credit trust on-chain.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/propose"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#BE5103] hover:bg-[#973e00] text-white px-8 py-4 rounded-full text-base font-semibold shadow-md hover:shadow-xl transition-all hover-lift"
            >
              Propose a Loan
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/offers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#fff8f5] hover:bg-[#ffe3d2] text-[#332216] border border-[#332216]/20 px-8 py-4 rounded-full text-base font-semibold transition-all hover-lift"
            >
              Explore Offers
            </Link>
          </div>
        </motion.div>

        {/* Live Platform Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 bg-[#fff8f5] rounded-3xl p-6 sm:p-8 border border-[#332216]/10 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FBF3E8] border border-[#332216]/5">
            <div className="p-3.5 rounded-xl bg-[#BE5103]/10 text-[#BE5103]">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-[#8e4e20] tracking-wider">
                Total Value Funded
              </p>
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#332216] mt-0.5">
                ${formatTokenAmount(platformStats.totalFunded)}
              </p>
              <p className="text-xs text-[#6a5d36] mt-0.5">Across USDC & EURC pools</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FBF3E8] border border-[#332216]/5">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-700">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-[#8e4e20] tracking-wider">
                Successful Repayments
              </p>
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#332216] mt-0.5">
                ${formatTokenAmount(platformStats.totalRepaid)}
              </p>
              <p className="text-xs text-emerald-700 font-medium mt-0.5">99.8% On-time repayment rate</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FBF3E8] border border-[#332216]/5">
            <div className="p-3.5 rounded-xl bg-[#6a5d36]/10 text-[#6a5d36]">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-[#8e4e20] tracking-wider">
                Active Negotiations
              </p>
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#332216] mt-0.5">
                {Number(platformStats.activeNegotiations).toLocaleString()}
              </p>
              <p className="text-xs text-[#8e4e20] mt-0.5">Live offer threads on Arc</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it Works / The Lending Lifecycle */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#332216]">
            The Veloure Lending Lifecycle
          </h2>
          <p className="text-[#8e4e20] max-w-xl mx-auto text-sm sm:text-base">
            Bilateral agreement built directly on-chain with zero black-box liquidity pool markups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Propose Terms',
              desc: 'Select USDC or EURC, principal amount, target borrower, interest rate in Bps, and loan duration.',
              icon: FileCheck,
            },
            {
              step: '02',
              title: 'Counter & Negotiate',
              desc: 'Borrower or lender can counter with new terms in an unlimited bilateral negotiation chain.',
              icon: Layers,
            },
            {
              step: '03',
              title: 'Instant Funding',
              desc: 'Upon agreement, acceptance triggers immediate ERC20 transfer directly into borrower address.',
              icon: Coins,
            },
            {
              step: '04',
              title: 'Repay & Build Trust',
              desc: 'Repay partially or fully before due date to permanently increase on-chain reputation score.',
              icon: ShieldCheck,
            },
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#fff8f5] rounded-2xl p-6 border border-[#332216]/10 relative hover-lift group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-bold text-3xl text-[#BE5103]/30 group-hover:text-[#BE5103] transition-colors">
                  {item.step}
                </span>
                <div className="p-2.5 rounded-xl bg-[#BE5103]/10 text-[#BE5103]">
                  <item.icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-display font-bold text-lg text-[#332216] mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-[#8e4e20] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reputation Core Transparency Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#fff8f5] to-[#ffe3d2]/40 rounded-3xl p-8 lg:p-12 border border-[#332216]/10 shadow-md grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6a5d36]/10 text-[#6a5d36] text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              Reputation Core Protocol
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#332216] leading-tight">
              On-Chain Credit Transparency, <br />
              <span className="text-[#BE5103]">Without Middlemen</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8e4e20] leading-relaxed">
              Every loan repayment on Arc Testnet updates the borrower’s on-chain reputation ledger permanently. Lenders verify borrower repayment history before issuing proposals, minimizing risk while rewarding reliable borrowers with lower interest rates.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FBF3E8] border border-[#332216]/10">
                <p className="text-xs font-semibold text-[#8e4e20] uppercase">Repayment Record</p>
                <p className="font-display text-xl font-bold text-[#332216] mt-1">Immutable</p>
              </div>
              <div className="p-4 rounded-xl bg-[#FBF3E8] border border-[#332216]/10">
                <p className="text-xs font-semibold text-[#8e4e20] uppercase">Default Penalties</p>
                <p className="font-display text-xl font-bold text-red-700 mt-1">Public Mark</p>
              </div>
            </div>
            <div className="pt-2">
              <Link
                to="/reputation"
                className="inline-flex items-center gap-2 bg-[#332216] hover:bg-[#20150d] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all hover-lift"
              >
                Search Reputation Profiles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Sample Reputation Card UI */}
          <div className="bg-[#FBF3E8] rounded-2xl p-6 sm:p-8 border border-[#332216]/15 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#332216]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#BE5103] text-white flex items-center justify-center font-bold text-sm font-mono">
                  0x8a
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-[#332216]">
                    0x8a1c...a234
                  </p>
                  <p className="text-[11px] text-[#8e4e20]">Arc Testnet Active Borrower</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300">
                Excellent Credit (100%)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#fff8f5] border border-[#332216]/5">
                <p className="text-xs font-medium text-[#8e4e20]">Loans Repaid</p>
                <p className="font-display text-2xl font-bold text-emerald-700 mt-1">12</p>
              </div>
              <div className="p-3 rounded-xl bg-[#fff8f5] border border-[#332216]/5">
                <p className="text-xs font-medium text-[#8e4e20]">Active Loans</p>
                <p className="font-display text-2xl font-bold text-[#BE5103] mt-1">2</p>
              </div>
              <div className="p-3 rounded-xl bg-[#fff8f5] border border-[#332216]/5">
                <p className="text-xs font-medium text-[#8e4e20]">Defaulted</p>
                <p className="font-display text-2xl font-bold text-stone-500 mt-1">0</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#332216]">
                <span>Repayment Consistency</span>
                <span className="text-emerald-700">100% Repaid</span>
              </div>
              <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Veloure Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#fff8f5] rounded-3xl p-8 lg:p-12 border border-[#332216]/10 space-y-8">
          <div className="max-w-3xl space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#332216]">
              About Veloure
            </h2>
            <p className="text-[#8e4e20] text-base leading-relaxed font-sans">
              Traditional DeFi lending forces borrowers into overcollateralization—requiring $150 of crypto locked up to borrow $100. Veloure flips this model by enabling bilateral credit negotiations backed by on-chain reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FBF3E8] border border-[#332216]/10 space-y-2">
              <Building2 className="w-8 h-8 text-[#BE5103]" />
              <h3 className="font-display font-bold text-lg text-[#332216]">Bilateral Direct Terms</h3>
              <p className="text-xs sm:text-sm text-[#8e4e20] leading-relaxed">
                No pool spreads or arbitrary interest algorithms. Borrowers and lenders agree on exact interest rates and durations directly.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FBF3E8] border border-[#332216]/10 space-y-2">
              <Coins className="w-8 h-8 text-[#BE5103]" />
              <h3 className="font-display font-bold text-lg text-[#332216]">USDC & EURC Stablecoins</h3>
              <p className="text-xs sm:text-sm text-[#8e4e20] leading-relaxed">
                Seamless funding with standard stablecoin tokens on Arc Testnet, providing predictable loan accounting without price volatility risk.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FBF3E8] border border-[#332216]/10 space-y-2">
              <Globe className="w-8 h-8 text-[#BE5103]" />
              <h3 className="font-display font-bold text-lg text-[#332216]">Arc Testnet Scalability</h3>
              <p className="text-xs sm:text-sm text-[#8e4e20] leading-relaxed">
                Sub-second transaction times and micro-cent gas fees make multi-round counter-proposals fast and frictionless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BE5103]/10 text-[#BE5103] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Protocol Evolution
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#332216]">
            Veloure Development Roadmap
          </h2>
          <p className="text-[#8e4e20] max-w-xl mx-auto text-sm sm:text-base">
            Phased rollout from Arc Testnet deployment to decentralized governance.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {roadmapPhases.map((phase, idx) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#fff8f5] rounded-2xl p-6 border border-[#332216]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover-lift"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-[#BE5103] text-sm tracking-widest uppercase">
                    {phase.phase}
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold border ${phase.statusBg}`}
                  >
                    {phase.status}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-[#332216]">
                  {phase.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8e4e20] leading-relaxed">
                  {phase.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center space-y-3 mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#332216]">
            Frequently Asked Questions
          </h2>
          <p className="text-[#8e4e20] text-sm sm:text-base">
            Everything you need to know about peer-to-peer lending on Veloure and Arc Testnet.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#fff8f5] rounded-2xl border border-[#332216]/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-display font-semibold text-base sm:text-lg text-[#332216] hover:bg-[#ffe3d2]/30 transition-colors"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#BE5103] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#8e4e20] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#8e4e20] leading-relaxed border-t border-[#332216]/5 font-sans">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
