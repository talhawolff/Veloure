import React, { useState } from 'react';
import { useVeloureContract } from '../lib/useVeloureContract';
import { OfferStatus, FormattedOffer, TokenType } from '../types';
import { formatAddress, bpsToPercentage } from '../lib/formatters';
import {
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Send,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Coins,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react';

export const Offers: React.FC = () => {
  const {
    address,
    isConnected,
    localOffers,
    acceptOffer,
    counterOffer,
    rejectOffer,
    withdrawOffer,
    isProcessing,
    txError,
  } = useVeloureContract();

  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedOfferId, setExpandedOfferId] = useState<number | null>(null);

  // Counter offer modal state
  const [counterModalOffer, setCounterModalOffer] = useState<FormattedOffer | null>(null);
  const [counterPrincipal, setCounterPrincipal] = useState<string>('');
  const [counterInterestBps, setCounterInterestBps] = useState<number>(500); // 5% default
  const [counterDurationDays, setCounterDurationDays] = useState<number>(30);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Filter offers based on connected address & tabs
  const filteredOffers = localOffers.filter((offer) => {
    const isUserProposer = address ? offer.proposer.toLowerCase() === address.toLowerCase() : offer.isProposer;
    const isUserCounterparty = address ? offer.counterparty.toLowerCase() === address.toLowerCase() : !offer.isProposer;

    if (activeTab === 'received' && !isUserCounterparty) return false;
    if (activeTab === 'sent' && !isUserProposer) return false;

    if (filterStatus === 'pending') return offer.status === OfferStatus.Pending;
    if (filterStatus === 'countered') return offer.status === OfferStatus.Countered;
    if (filterStatus === 'accepted') return offer.status === OfferStatus.Accepted;
    if (filterStatus === 'rejected') return offer.status === OfferStatus.Rejected;
    if (filterStatus === 'withdrawn') return offer.status === OfferStatus.Withdrawn;

    return true;
  });

  const handleOpenCounterModal = (offer: FormattedOffer) => {
    setCounterModalOffer(offer);
    const cleanPrincipal = offer.principalFormatted.replace(/[^0-9.]/g, '');
    setCounterPrincipal(cleanPrincipal);
    setCounterInterestBps(offer.interestBps);
    setCounterDurationDays(offer.durationDays);
  };

  const handleSubmitCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterModalOffer) return;
    try {
      await counterOffer(
        counterModalOffer.id,
        counterPrincipal,
        counterInterestBps,
        counterDurationDays
      );
      setCounterModalOffer(null);
      setActionSuccessMsg('Counter offer submitted successfully!');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (offerId: number) => {
    try {
      await acceptOffer(offerId);
      setActionSuccessMsg('Offer accepted! Loan converted to Active status.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (offerId: number) => {
    try {
      await rejectOffer(offerId);
      setActionSuccessMsg('Offer rejected.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async (offerId: number) => {
    try {
      await withdrawOffer(offerId);
      setActionSuccessMsg('Offer withdrawn.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#332216]/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8e4e20] uppercase tracking-wider">
            <Layers className="w-4 h-4 text-[#BE5103]" />
            Bilateral Negotiations
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#332216] mt-1">
            My Offers & Counter-Proposals
          </h1>
          <p className="text-sm text-[#8e4e20] mt-1">
            Review incoming proposal threads, adjust rates or terms, and accept loans on Arc Testnet.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 bg-[#fff8f5] border border-[#332216]/15 rounded-full shadow-xs">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'received'
                ? 'bg-[#BE5103] text-white shadow-xs'
                : 'text-[#332216] hover:bg-[#ffe3d2]/50'
            }`}
          >
            Received ({localOffers.filter(o => o.status === OfferStatus.Pending || o.status === OfferStatus.Countered).length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'sent'
                ? 'bg-[#BE5103] text-white shadow-xs'
                : 'text-[#332216] hover:bg-[#ffe3d2]/50'
            }`}
          >
            Sent / Proposed
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span className="text-sm font-semibold">{actionSuccessMsg}</span>
        </div>
      )}

      {/* Error Banner */}
      {txError && (
        <div className="p-4 rounded-2xl bg-red-100 border border-red-300 text-red-900 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
          <span className="text-sm font-medium">{txError}</span>
        </div>
      )}

      {/* Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#8e4e20] mr-2">Status:</span>
        {['all', 'pending', 'countered', 'accepted', 'rejected', 'withdrawn'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
              filterStatus === st
                ? 'bg-[#332216] text-white shadow-xs'
                : 'bg-[#fff8f5] text-[#332216] border border-[#332216]/10 hover:bg-[#ffe3d2]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      {filteredOffers.length === 0 ? (
        <div className="bg-[#fff8f5] rounded-3xl p-12 text-center border border-[#332216]/10 space-y-4">
          <Coins className="w-12 h-12 text-[#8e4e20]/40 mx-auto" />
          <h3 className="font-display font-bold text-xl text-[#332216]">No offers found</h3>
          <p className="text-xs sm:text-sm text-[#8e4e20] max-w-md mx-auto">
            {activeTab === 'received'
              ? 'You have no incoming offers matching this filter.'
              : 'You have not submitted any loan proposals yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredOffers.map((offer) => {
            const isPending = offer.status === OfferStatus.Pending;
            const isCountered = offer.status === OfferStatus.Countered;
            const isAccepted = offer.status === OfferStatus.Accepted;
            const isRejected = offer.status === OfferStatus.Rejected;
            const isWithdrawn = offer.status === OfferStatus.Withdrawn;

            const isExpanded = expandedOfferId === offer.id;

            return (
              <div
                key={offer.id}
                className="bg-[#fff8f5] rounded-2xl p-6 border border-[#332216]/10 shadow-xs hover:border-[#BE5103]/30 transition-all space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#332216]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#332216]/5 text-[#332216]">
                      Offer #{offer.id}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        isPending
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : isCountered
                          ? 'bg-purple-100 text-purple-900 border-purple-300'
                          : isAccepted
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : isRejected
                          ? 'bg-red-100 text-red-900 border-red-300'
                          : 'bg-stone-100 text-stone-700 border-stone-300'
                      }`}
                    >
                      {offer.statusText}
                    </span>
                    {isPending && (
                      <span className="text-xs font-semibold text-[#BE5103] bg-[#BE5103]/10 px-2.5 py-0.5 rounded-full">
                        Action Required
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-[#8e4e20] font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {offer.timestampFormatted}
                  </span>
                </div>

                {/* Offer Main Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#FBF3E8] p-4 rounded-xl border border-[#332216]/5">
                  <div>
                    <p className="text-[11px] uppercase font-semibold text-[#8e4e20]">Principal Asset</p>
                    <p className="font-display font-bold text-lg text-[#332216] mt-0.5">
                      {offer.principalFormatted}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-semibold text-[#8e4e20]">Interest Rate</p>
                    <p className="font-display font-bold text-lg text-[#BE5103] mt-0.5">
                      {offer.interestRatePct}{' '}
                      <span className="text-xs font-normal text-[#8e4e20]">({offer.interestBps} Bps)</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-semibold text-[#8e4e20]">Duration</p>
                    <p className="font-display font-bold text-lg text-[#332216] mt-0.5">
                      {offer.durationDays} Days
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-semibold text-[#8e4e20]">Target Borrower</p>
                    <p className="font-mono text-sm font-bold text-[#332216] mt-1">
                      {formatAddress(offer.borrower)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons & Thread Trigger */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <button
                    onClick={() => setExpandedOfferId(isExpanded ? null : offer.id)}
                    className="text-xs text-[#8e4e20] hover:text-[#BE5103] font-semibold flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        Hide Negotiation Breakdown <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        View Negotiation Breakdown <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Accept button */}
                    {(isPending || isCountered) && (
                      <button
                        onClick={() => handleAccept(offer.id)}
                        disabled={isProcessing}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accept & Fund Loan
                      </button>
                    )}

                    {/* Counter button */}
                    {(isPending || isCountered) && (
                      <button
                        onClick={() => handleOpenCounterModal(offer)}
                        disabled={isProcessing}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#BE5103] hover:bg-[#973e00] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Counter Terms
                      </button>
                    )}

                    {/* Reject button */}
                    {(isPending || isCountered) && (
                      <button
                        onClick={() => handleReject(offer.id)}
                        disabled={isProcessing}
                        className="inline-flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2.5 rounded-full text-xs font-bold transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    )}

                    {/* Withdraw button */}
                    {isPending && offer.isProposer && (
                      <button
                        onClick={() => handleWithdraw(offer.id)}
                        disabled={isProcessing}
                        className="inline-flex items-center justify-center gap-1 bg-stone-200 hover:bg-stone-300 text-stone-800 px-4 py-2.5 rounded-full text-xs font-bold transition-all disabled:opacity-50"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Thread Breakdown */}
                {isExpanded && (
                  <div className="mt-4 p-4 rounded-xl bg-[#FBF3E8] border border-[#332216]/10 space-y-3 animate-in fade-in">
                    <h4 className="text-xs font-bold text-[#332216] uppercase tracking-wider">
                      Financial Calculation Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#8e4e20]">
                      <div>
                        <span>Estimated Interest Owed:</span>
                        <p className="font-bold text-[#332216] font-display text-sm mt-0.5">
                          {((Number(offer.principalRaw) * offer.interestBps) / 10000 / 1e6).toLocaleString()} {offer.token}
                        </p>
                      </div>
                      <div>
                        <span>Total Loan Repayment:</span>
                        <p className="font-bold text-[#BE5103] font-display text-sm mt-0.5">
                          {(
                            (Number(offer.principalRaw) +
                              (Number(offer.principalRaw) * offer.interestBps) / 10000) /
                            1e6
                          ).toLocaleString()} {offer.token}
                        </p>
                      </div>
                      <div>
                        <span>Proposer Wallet:</span>
                        <p className="font-mono font-bold text-[#332216] text-xs mt-0.5">
                          {formatAddress(offer.proposer)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Counter Offer Modal / Drawer */}
      {counterModalOffer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FBF3E8] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#332216]/20 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#332216]/10 pb-4">
              <div>
                <h3 className="font-display font-bold text-2xl text-[#332216]">
                  Counter Offer #{counterModalOffer.id}
                </h3>
                <p className="text-xs text-[#8e4e20] mt-0.5">
                  Modify terms and send back to {formatAddress(counterModalOffer.proposer)}
                </p>
              </div>
              <button
                onClick={() => setCounterModalOffer(null)}
                className="p-2 text-[#332216] hover:bg-[#ffe3d2] rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCounter} className="space-y-5">
              {/* Principal Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#332216] uppercase">
                  Principal ({counterModalOffer.token})
                </label>
                <input
                  type="number"
                  step="any"
                  value={counterPrincipal}
                  onChange={(e) => setCounterPrincipal(e.target.value)}
                  className="w-full bg-[#fff8f5] border border-[#332216]/20 rounded-xl px-4 py-3 text-base font-bold text-[#332216] focus:outline-none focus:ring-2 focus:ring-[#BE5103]"
                  required
                />
              </div>

              {/* Interest Rate Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#332216]">
                  <span>Interest Rate</span>
                  <span className="text-[#BE5103]">
                    {(counterInterestBps / 100).toFixed(2)}% ({counterInterestBps} Bps)
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2500"
                  step="25"
                  value={counterInterestBps}
                  onChange={(e) => setCounterInterestBps(Number(e.target.value))}
                  className="w-full accent-[#BE5103]"
                />
              </div>

              {/* Duration Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#332216] uppercase">
                  Loan Duration (Days)
                </label>
                <select
                  value={counterDurationDays}
                  onChange={(e) => setCounterDurationDays(Number(e.target.value))}
                  className="w-full bg-[#fff8f5] border border-[#332216]/20 rounded-xl px-4 py-3 text-sm font-semibold text-[#332216]"
                >
                  <option value={7}>7 Days (1 Week)</option>
                  <option value={14}>14 Days (2 Weeks)</option>
                  <option value={30}>30 Days (1 Month)</option>
                  <option value={60}>60 Days (2 Months)</option>
                  <option value={90}>90 Days (3 Months)</option>
                </select>
              </div>

              {/* Calculation Preview */}
              <div className="p-4 rounded-xl bg-[#fff8f5] border border-[#332216]/10 space-y-1 text-xs">
                <div className="flex justify-between text-[#8e4e20]">
                  <span>Total Repayment Owed:</span>
                  <span className="font-bold text-[#BE5103] text-sm">
                    {(
                      (parseFloat(counterPrincipal || '0') * (1 + counterInterestBps / 10000)) || 0
                    ).toLocaleString()}{' '}
                    {counterModalOffer.token}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCounterModalOffer(null)}
                  className="flex-1 px-4 py-3 rounded-full border border-[#332216]/20 text-xs font-bold text-[#332216] hover:bg-[#ffe3d2]/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-[#BE5103] hover:bg-[#973e00] text-white px-4 py-3 rounded-full text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Submitting...' : 'Send Counter Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
