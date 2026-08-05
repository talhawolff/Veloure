import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVeloureContract } from '../lib/useVeloureContract';
import { TokenType, UserReputation } from '../types';
import { getTrustScore, formatAddress } from '../lib/formatters';
import {
  FilePlus,
  Search,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Coins,
  Percent,
  Calendar,
  Sparkles,
  User,
} from 'lucide-react';

export const ProposeLoan: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected, fetchReputation, createOffer, isProcessing, txError } = useVeloureContract();

  const [step, setStep] = useState<number>(1);

  // Step 1: Target Borrower & Reputation
  const [borrowerAddress, setBorrowerAddress] = useState<string>('0xb5EFA2B7004F79cAC0F8f7B1557f20238a2346Ee');
  const [reputationData, setReputationData] = useState<UserReputation | null>(null);
  const [isFetchingRep, setIsFetchingRep] = useState<boolean>(false);

  // Step 2: Terms Configuration
  const [selectedToken, setSelectedToken] = useState<TokenType>(TokenType.USDC);
  const [principalStr, setPrincipalStr] = useState<string>('5000');
  const [interestBps, setInterestBps] = useState<number>(550); // 5.5%
  const [durationDays, setDurationDays] = useState<number>(30);

  // Step 3: Success state
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Fetch reputation when borrower address changes
  useEffect(() => {
    if (borrowerAddress && borrowerAddress.startsWith('0x') && borrowerAddress.length === 42) {
      setIsFetchingRep(true);
      fetchReputation(borrowerAddress)
        .then((rep) => setReputationData(rep))
        .catch(console.error)
        .finally(() => setIsFetchingRep(false));
    }
  }, [borrowerAddress, fetchReputation]);

  const principalNum = parseFloat(principalStr) || 0;
  const interestAmount = (principalNum * interestBps) / 10000;
  const totalRepayment = principalNum + interestAmount;

  const handleSendOffer = async () => {
    try {
      await createOffer(
        borrowerAddress,
        selectedToken,
        principalStr,
        interestBps,
        durationDays
      );
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  const trustInfo = reputationData
    ? getTrustScore(
        Number(reputationData.loansRepaid),
        Number(reputationData.activeLoans),
        Number(reputationData.defaulted)
      )
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BE5103]/10 text-[#BE5103] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Arc Testnet Bilateral Offer Creation
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#332216]">
          Propose a Custom Loan
        </h1>
        <p className="text-sm text-[#8e4e20] max-w-lg mx-auto">
          Specify target borrower, loan principal asset, interest rate, and duration for on-chain agreement.
        </p>
      </div>

      {/* Progress Wizard Steps */}
      <div className="flex items-center justify-between max-w-xl mx-auto px-4">
        {[
          { num: 1, title: 'Borrower & Credit' },
          { num: 2, title: 'Loan Terms' },
          { num: 3, title: 'Review & Send' },
        ].map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#BE5103] text-white shadow-md'
                    : step > s.num
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#fff8f5] border border-[#332216]/20 text-[#8e4e20]'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span
                className={`text-[11px] font-semibold ${
                  step === s.num ? 'text-[#332216]' : 'text-[#8e4e20]'
                }`}
              >
                {s.title}
              </span>
            </div>
            {idx < 2 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  step > idx + 1 ? 'bg-emerald-700' : 'bg-[#332216]/10'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Error Message */}
      {txError && (
        <div className="p-4 rounded-2xl bg-red-100 border border-red-300 text-red-900 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
          <span className="text-sm font-medium">{txError}</span>
        </div>
      )}

      {/* Success View */}
      {isSuccess ? (
        <div className="bg-[#fff8f5] rounded-3xl p-10 border border-[#332216]/10 shadow-lg text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-bold text-3xl text-[#332216]">
              Offer Sent On-Chain!
            </h2>
            <p className="text-sm text-[#8e4e20] max-w-md mx-auto">
              Your loan proposal for {principalNum.toLocaleString()} {selectedToken === TokenType.USDC ? 'USDC' : 'EURC'} has been broadcast to {formatAddress(borrowerAddress)} on Arc Testnet.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate('/offers')}
              className="w-full sm:w-auto bg-[#BE5103] hover:bg-[#973e00] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-md transition-all"
            >
              View in My Offers
            </button>
            <button
              onClick={() => {
                setIsSuccess(false);
                setStep(1);
              }}
              className="w-full sm:w-auto bg-[#fff8f5] hover:bg-[#ffe3d2] text-[#332216] border border-[#332216]/20 px-8 py-3.5 rounded-full text-sm font-bold transition-all"
            >
              Propose Another Loan
            </button>
          </div>
        </div>
      ) : (
        /* Wizard Form Body */
        <div className="bg-[#fff8f5] rounded-3xl p-6 sm:p-10 border border-[#332216]/10 shadow-md space-y-8">
          {/* STEP 1: Borrower & Credit */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#332216] uppercase tracking-wider block">
                  Target Borrower Wallet Address (Arc Testnet)
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8e4e20]" />
                  <input
                    type="text"
                    value={borrowerAddress}
                    onChange={(e) => setBorrowerAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-[#FBF3E8] border border-[#332216]/20 rounded-2xl pl-12 pr-4 py-3.5 font-mono text-sm font-bold text-[#332216] focus:outline-none focus:ring-2 focus:ring-[#BE5103]"
                  />
                </div>
              </div>

              {/* Borrower Reputation Preview Card */}
              <div className="p-6 rounded-2xl bg-[#FBF3E8] border border-[#332216]/15 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#8e4e20] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#BE5103]" />
                    Target Borrower Reputation Score
                  </span>
                  {trustInfo && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${trustInfo.badgeColor}`}
                    >
                      {trustInfo.score}
                    </span>
                  )}
                </div>

                {isFetchingRep ? (
                  <div className="py-6 text-center text-xs text-[#8e4e20] animate-pulse">
                    Querying Arc Testnet reputation ledger...
                  </div>
                ) : reputationData ? (
                  <div className="grid grid-cols-3 gap-3 text-center pt-2">
                    <div className="p-3 rounded-xl bg-[#fff8f5] border border-[#332216]/5">
                      <p className="text-[11px] font-semibold text-[#8e4e20]">Loans Repaid</p>
                      <p className="font-display text-2xl font-bold text-emerald-700 mt-0.5">
                        {reputationData.loansRepaid.toString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#fff8f5] border border-[#332216]/5">
                      <p className="text-[11px] font-semibold text-[#8e4e20]">Active Loans</p>
                      <p className="font-display text-2xl font-bold text-[#BE5103] mt-0.5">
                        {reputationData.activeLoans.toString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#fff8f5] border border-[#332216]/5">
                      <p className="text-[11px] font-semibold text-[#8e4e20]">Defaulted</p>
                      <p className="font-display text-2xl font-bold text-stone-500 mt-0.5">
                        {reputationData.defaulted.toString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#8e4e20]">Enter a valid 0x address to preview history.</p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={!borrowerAddress || borrowerAddress.length < 42}
                  className="inline-flex items-center gap-2 bg-[#BE5103] hover:bg-[#973e00] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-md transition-all disabled:opacity-50"
                >
                  Continue to Terms <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Loan Terms */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Asset Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#332216] uppercase tracking-wider block">
                  Select Stablecoin Asset
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedToken(TokenType.USDC)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      selectedToken === TokenType.USDC
                        ? 'bg-[#BE5103]/10 border-[#BE5103] text-[#332216] shadow-xs'
                        : 'bg-[#FBF3E8] border-[#332216]/15 text-[#8e4e20] hover:bg-[#ffe3d2]/50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-base">USDC</p>
                      <p className="text-xs text-[#8e4e20]">Circle USD Coin on Arc</p>
                    </div>
                    <Coins className="w-6 h-6 text-[#BE5103]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedToken(TokenType.EURC)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      selectedToken === TokenType.EURC
                        ? 'bg-[#BE5103]/10 border-[#BE5103] text-[#332216] shadow-xs'
                        : 'bg-[#FBF3E8] border-[#332216]/15 text-[#8e4e20] hover:bg-[#ffe3d2]/50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-base">EURC</p>
                      <p className="text-xs text-[#8e4e20]">Circle Euro Coin on Arc</p>
                    </div>
                    <Coins className="w-6 h-6 text-[#BE5103]" />
                  </button>
                </div>
              </div>

              {/* Principal Amount */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#332216] uppercase tracking-wider block">
                  Principal Amount ({selectedToken === TokenType.USDC ? 'USDC' : 'EURC'})
                </label>
                <input
                  type="number"
                  step="any"
                  value={principalStr}
                  onChange={(e) => setPrincipalStr(e.target.value)}
                  className="w-full bg-[#FBF3E8] border border-[#332216]/20 rounded-2xl px-4 py-3.5 font-display text-2xl font-bold text-[#332216] focus:outline-none focus:ring-2 focus:ring-[#BE5103]"
                />
              </div>

              {/* Interest Rate Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#332216]">
                  <span>Interest Rate (Bps)</span>
                  <span className="text-[#BE5103] font-display text-lg">
                    {(interestBps / 100).toFixed(2)}% ({interestBps} Bps)
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="25"
                  value={interestBps}
                  onChange={(e) => setInterestBps(Number(e.target.value))}
                  className="w-full accent-[#BE5103]"
                />
              </div>

              {/* Duration Days */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#332216] uppercase tracking-wider block">
                  Loan Duration
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[7, 14, 30, 60].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDurationDays(d)}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                        durationDays === d
                          ? 'bg-[#332216] text-white border-[#332216]'
                          : 'bg-[#FBF3E8] text-[#332216] border-[#332216]/15 hover:bg-[#ffe3d2]'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 bg-[#FBF3E8] text-[#332216] border border-[#332216]/20 px-6 py-3 rounded-full text-xs font-bold"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 bg-[#BE5103] hover:bg-[#973e00] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-md transition-all"
                >
                  Review Proposal <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Send */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#FBF3E8] border border-[#332216]/15 space-y-4">
                <h3 className="font-display font-bold text-xl text-[#332216]">
                  Proposal Financial Summary
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8e4e20]">Borrower Address:</span>
                    <p className="font-mono font-bold text-[#332216] mt-0.5">{formatAddress(borrowerAddress)}</p>
                  </div>
                  <div>
                    <span className="text-[#8e4e20]">Principal Asset:</span>
                    <p className="font-bold text-[#332216] mt-0.5">
                      {principalNum.toLocaleString()} {selectedToken === TokenType.USDC ? 'USDC' : 'EURC'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#8e4e20]">Interest Rate:</span>
                    <p className="font-bold text-[#BE5103] mt-0.5">
                      {(interestBps / 100).toFixed(2)}% ({interestBps} Bps)
                    </p>
                  </div>
                  <div>
                    <span className="text-[#8e4e20]">Duration:</span>
                    <p className="font-bold text-[#332216] mt-0.5">{durationDays} Days</p>
                  </div>
                </div>

                <div className="border-t border-[#332216]/10 pt-4 flex justify-between items-center">
                  <span className="font-semibold text-xs text-[#8e4e20]">Total Due Upon Completion:</span>
                  <span className="font-display text-xl font-bold text-[#BE5103]">
                    {totalRepayment.toLocaleString()} {selectedToken === TokenType.USDC ? 'USDC' : 'EURC'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 bg-[#FBF3E8] text-[#332216] border border-[#332216]/20 px-6 py-3 rounded-full text-xs font-bold"
                >
                  <ArrowLeft className="w-4 h-4" /> Edit Terms
                </button>
                <button
                  type="button"
                  onClick={handleSendOffer}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 bg-[#BE5103] hover:bg-[#973e00] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Broadcasting to Arc...' : 'Send Offer On-Chain'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
