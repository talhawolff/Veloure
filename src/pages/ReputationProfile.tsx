import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVeloureContract } from '../lib/useVeloureContract';
import { UserReputation } from '../types';
import { getTrustScore, formatAddress, formatDate } from '../lib/formatters';
import { OWNER_ADDRESS } from '../config/contracts';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  User,
  ExternalLink,
  Coins,
  Sparkles,
} from 'lucide-react';

export const ReputationProfile: React.FC = () => {
  const { address: routeAddress } = useParams<{ address?: string }>();
  const navigate = useNavigate();
  const { address: connectedAddress, fetchReputation, localLoans, localOffers } = useVeloureContract();

  const [searchAddress, setSearchAddress] = useState<string>(
    routeAddress || connectedAddress || OWNER_ADDRESS
  );
  const [activeProfileAddress, setActiveProfileAddress] = useState<string>(
    routeAddress || connectedAddress || OWNER_ADDRESS
  );

  const [reputation, setReputation] = useState<UserReputation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (activeProfileAddress && activeProfileAddress.startsWith('0x') && activeProfileAddress.length === 42) {
      setIsLoading(true);
      fetchReputation(activeProfileAddress)
        .then((rep) => setReputation(rep))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [activeProfileAddress, fetchReputation]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchAddress && searchAddress.startsWith('0x') && searchAddress.length === 42) {
      setActiveProfileAddress(searchAddress);
      navigate(`/reputation/${searchAddress}`);
    }
  };

  const trust = reputation
    ? getTrustScore(
        Number(reputation.loansRepaid),
        Number(reputation.activeLoans),
        Number(reputation.defaulted)
      )
    : null;

  const totalClosed = (reputation ? Number(reputation.loansRepaid) + Number(reputation.defaulted) : 0);
  const successRatePct = totalClosed > 0 ? (Number(reputation?.loansRepaid || 0) / totalClosed) * 100 : 100;

  // Filter history loans for searched user
  const userLoans = localLoans.filter(
    (l) =>
      l.borrower.toLowerCase() === activeProfileAddress.toLowerCase() ||
      l.lender.toLowerCase() === activeProfileAddress.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#332216]/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8e4e20] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#BE5103]" />
            On-Chain Reputation Ledger
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#332216] mt-1">
            Reputation Profile Lookup
          </h1>
          <p className="text-sm text-[#8e4e20] mt-1">
            Verify borrower repayment records and loan history on Arc Testnet before proposing credit terms.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex items-center gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e4e20]" />
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Search 0x wallet address..."
              className="w-full bg-[#fff8f5] border border-[#332216]/20 rounded-full pl-10 pr-4 py-2 text-xs font-mono font-bold text-[#332216] focus:outline-none focus:ring-2 focus:ring-[#BE5103]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#BE5103] hover:bg-[#973e00] text-white px-5 py-2 rounded-full text-xs font-bold transition-all shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Profile Card */}
      {isLoading ? (
        <div className="bg-[#fff8f5] rounded-3xl p-12 text-center border border-[#332216]/10 animate-pulse text-[#8e4e20] text-sm">
          Fetching Arc Testnet reputation record for {formatAddress(activeProfileAddress)}...
        </div>
      ) : (
        <div className="bg-[#fff8f5] rounded-3xl p-6 sm:p-10 border border-[#332216]/10 shadow-md space-y-8">
          {/* User Address Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#332216]/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#BE5103] text-white flex items-center justify-center font-bold font-mono text-lg shadow-md">
                {activeProfileAddress.substring(2, 4).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-mono font-bold text-lg sm:text-2xl text-[#332216]">
                    {formatAddress(activeProfileAddress, 6)}
                  </h2>
                  <a
                    href={`https://testnet.arcscan.app/address/${activeProfileAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-[#8e4e20] hover:text-[#BE5103]"
                    title="View on ArcScan"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-[#8e4e20] font-medium">Arc Testnet Verified Account</p>
              </div>
            </div>

            {trust && (
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold border ${trust.badgeColor}`}
              >
                Trust Rating: {trust.score}
              </span>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#FBF3E8] border border-[#332216]/10">
              <p className="text-xs font-semibold text-[#8e4e20] uppercase">Loans Repaid</p>
              <p className="font-display text-3xl font-bold text-emerald-700 mt-1">
                {reputation?.loansRepaid.toString()}
              </p>
              <p className="text-[11px] text-[#8e4e20] mt-1">Successfully settled</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBF3E8] border border-[#332216]/10">
              <p className="text-xs font-semibold text-[#8e4e20] uppercase">Active Debt Obligations</p>
              <p className="font-display text-3xl font-bold text-[#BE5103] mt-1">
                {reputation?.activeLoans.toString()}
              </p>
              <p className="text-[11px] text-[#8e4e20] mt-1">Currently in progress</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBF3E8] border border-[#332216]/10">
              <p className="text-xs font-semibold text-[#8e4e20] uppercase">Defaulted Counter</p>
              <p className="font-display text-3xl font-bold text-stone-600 mt-1">
                {reputation?.defaulted.toString()}
              </p>
              <p className="text-[11px] text-[#8e4e20] mt-1">Unsettled past due date</p>
            </div>
          </div>

          {/* Success Rate Gauge */}
          <div className="p-6 rounded-2xl bg-[#FBF3E8] border border-[#332216]/10 space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#332216]">
              <span>Repayment Success Rate</span>
              <span className="text-emerald-700">{successRatePct.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${successRatePct}%` }}
              />
            </div>
          </div>

          {/* Loan Activity History */}
          <div className="space-y-4 pt-4">
            <h3 className="font-display font-bold text-xl text-[#332216]">
              Recent On-Chain Activity
            </h3>

            {userLoans.length === 0 ? (
              <p className="text-xs text-[#8e4e20] bg-[#FBF3E8] p-4 rounded-xl">
                No recent loan transactions found for this account.
              </p>
            ) : (
              <div className="space-y-3">
                {userLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="p-4 rounded-xl bg-[#FBF3E8] border border-[#332216]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#332216]">Loan #{loan.id}</span>
                      <p className="text-[#8e4e20] mt-0.5">
                        Role: {loan.borrower.toLowerCase() === activeProfileAddress.toLowerCase() ? 'Borrower' : 'Lender'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-display font-bold text-sm text-[#332216]">
                        {loan.principalFormatted}
                      </span>
                      <p className="text-emerald-700 font-semibold">{loan.statusText}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
