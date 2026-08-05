import React, { useState } from 'react';
import { useVeloureContract } from '../lib/useVeloureContract';
import { LoanStatus, FormattedLoan } from '../types';
import { formatAddress, formatDate, formatTokenAmount } from '../lib/formatters';
import {
  ShieldCheck,
  Clock,
  Coins,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const ActiveLoans: React.FC = () => {
  const {
    address,
    isConnected,
    localLoans,
    repayLoan,
    markDefaulted,
    isProcessing,
    txError,
  } = useVeloureContract();

  const [activeTab, setActiveTab] = useState<'borrower' | 'lender'>('borrower');
  const [repayModalLoan, setRepayModalLoan] = useState<FormattedLoan | null>(null);
  const [repayAmountStr, setRepayAmountStr] = useState<string>('');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Filter active loans by tab
  const activeLoans = localLoans.filter((loan) => {
    const isUserBorrower = address ? loan.borrower.toLowerCase() === address.toLowerCase() : loan.isBorrower;
    const isUserLender = address ? loan.lender.toLowerCase() === address.toLowerCase() : loan.isLender;

    if (activeTab === 'borrower' && !isUserBorrower) return false;
    if (activeTab === 'lender' && !isUserLender) return false;

    return loan.status === LoanStatus.Active;
  });

  const historicalLoans = localLoans.filter((loan) => {
    const isUserBorrower = address ? loan.borrower.toLowerCase() === address.toLowerCase() : loan.isBorrower;
    const isUserLender = address ? loan.lender.toLowerCase() === address.toLowerCase() : loan.isLender;

    if (activeTab === 'borrower' && !isUserBorrower) return false;
    if (activeTab === 'lender' && !isUserLender) return false;

    return loan.status !== LoanStatus.Active;
  });

  const handleOpenRepayModal = (loan: FormattedLoan) => {
    setRepayModalLoan(loan);
    const cleanOwed = loan.remainingOwedFormatted.replace(/[^0-9.]/g, '');
    setRepayAmountStr(cleanOwed);
  };

  const handleProcessRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repayModalLoan || !repayAmountStr) return;
    try {
      await repayLoan(repayModalLoan.id, repayAmountStr);
      setRepayModalLoan(null);
      setActionSuccessMsg('Repayment transaction submitted successfully on Arc Testnet!');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkDefaulted = async (loanId: number) => {
    try {
      await markDefaulted(loanId);
      setActionSuccessMsg('Loan marked as defaulted on-chain.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#332216]/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8e4e20] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#BE5103]" />
            On-Chain Debt & Credit
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#332216] mt-1">
            Active Loans & Repayments
          </h1>
          <p className="text-sm text-[#8e4e20] mt-1">
            Monitor active debt obligation status, execute repayments, or trigger default flags on Arc Testnet.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-[#fff8f5] border border-[#332216]/15 rounded-full shadow-xs">
          <button
            onClick={() => setActiveTab('borrower')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'borrower'
                ? 'bg-[#BE5103] text-white shadow-xs'
                : 'text-[#332216] hover:bg-[#ffe3d2]/50'
            }`}
          >
            As Borrower
          </button>
          <button
            onClick={() => setActiveTab('lender')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'lender'
                ? 'bg-[#BE5103] text-white shadow-xs'
                : 'text-[#332216] hover:bg-[#ffe3d2]/50'
            }`}
          >
            As Lender
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

      {/* Active Loans List */}
      {activeLoans.length === 0 ? (
        <div className="bg-[#fff8f5] rounded-3xl p-12 text-center border border-[#332216]/10 space-y-4">
          <Coins className="w-12 h-12 text-[#8e4e20]/40 mx-auto" />
          <h3 className="font-display font-bold text-xl text-[#332216]">No active loans</h3>
          <p className="text-xs sm:text-sm text-[#8e4e20] max-w-md mx-auto">
            {activeTab === 'borrower'
              ? 'You currently have no active borrowed loans.'
              : 'You currently have no active loans funded to borrowers.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeLoans.map((loan) => {
            const isOverdue = loan.isOverdue || (loan.dueDateRaw < Math.floor(Date.now() / 1000));

            return (
              <div
                key={loan.id}
                className="bg-[#fff8f5] rounded-2xl p-6 border border-[#332216]/10 shadow-xs hover:border-[#BE5103]/30 transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-[#332216]/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#332216]/5 text-[#332216]">
                        Loan #{loan.id}
                      </span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Active
                      </span>
                    </div>

                    {isOverdue && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Overdue
                      </span>
                    )}
                  </div>

                  {/* Addresses */}
                  <div className="flex justify-between text-xs text-[#8e4e20] bg-[#FBF3E8] p-3 rounded-xl">
                    <div>
                      <span>Lender:</span>
                      <p className="font-mono font-bold text-[#332216]">{formatAddress(loan.lender)}</p>
                    </div>
                    <div className="text-right">
                      <span>Borrower:</span>
                      <p className="font-mono font-bold text-[#332216]">{formatAddress(loan.borrower)}</p>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#8e4e20]">Principal Funded:</span>
                      <p className="font-display font-bold text-base text-[#332216]">
                        {loan.principalFormatted}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[#8e4e20]">Total Owed:</span>
                      <p className="font-display font-bold text-base text-[#BE5103]">
                        {loan.totalOwedFormatted}
                      </p>
                    </div>
                  </div>

                  {/* Repayment Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#8e4e20]">Repaid: {loan.totalRepaidFormatted}</span>
                      <span className="text-[#BE5103]">{loan.repaymentProgressPct.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#BE5103] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, loan.repaymentProgressPct)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#8e4e20] pt-1">
                    <span>Due Date: {loan.dueDateFormatted}</span>
                    <span className="font-bold text-[#332216]">Remaining: {loan.remainingOwedFormatted}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#332216]/10 flex gap-2">
                  <button
                    onClick={() => handleOpenRepayModal(loan)}
                    disabled={isProcessing}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#BE5103] hover:bg-[#973e00] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                  >
                    <DollarSign className="w-4 h-4" />
                    Make Repayment
                  </button>

                  {isOverdue && (
                    <button
                      onClick={() => handleMarkDefaulted(loan.id)}
                      disabled={isProcessing}
                      className="inline-flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2.5 rounded-full text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Mark Defaulted
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Historical Loans Toggle */}
      <div className="pt-6">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm font-semibold text-[#8e4e20] hover:text-[#BE5103] flex items-center gap-2"
        >
          {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showHistory ? 'Hide Historical & Completed Loans' : 'View Historical & Completed Loans'} ({historicalLoans.length})
        </button>

        {showHistory && (
          <div className="mt-4 space-y-4 animate-in fade-in">
            {historicalLoans.map((loan) => (
              <div
                key={loan.id}
                className="bg-[#FBF3E8] rounded-xl p-4 border border-[#332216]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#332216]">Loan #{loan.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
                        loan.status === LoanStatus.Repaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {loan.statusText}
                    </span>
                  </div>
                  <p className="text-[#8e4e20] mt-1">
                    Lender: {formatAddress(loan.lender)} • Borrower: {formatAddress(loan.borrower)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-sm text-[#332216]">
                    {loan.principalFormatted}
                  </p>
                  <p className="text-[#8e4e20]">Completed on Arc Testnet</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Repay Modal */}
      {repayModalLoan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FBF3E8] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#332216]/20 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#332216]/10 pb-4">
              <div>
                <h3 className="font-display font-bold text-2xl text-[#332216]">
                  Repay Loan #{repayModalLoan.id}
                </h3>
                <p className="text-xs text-[#8e4e20] mt-0.5">
                  Remaining Owed: {repayModalLoan.remainingOwedFormatted}
                </p>
              </div>
              <button
                onClick={() => setRepayModalLoan(null)}
                className="p-2 text-[#332216] hover:bg-[#ffe3d2] rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessRepay} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#332216] uppercase">
                  Repayment Amount ({repayModalLoan.token})
                </label>
                <input
                  type="number"
                  step="any"
                  value={repayAmountStr}
                  onChange={(e) => setRepayAmountStr(e.target.value)}
                  className="w-full bg-[#fff8f5] border border-[#332216]/20 rounded-xl px-4 py-3 text-lg font-bold text-[#332216] focus:outline-none focus:ring-2 focus:ring-[#BE5103]"
                  required
                />
              </div>

              <div className="p-4 rounded-xl bg-[#fff8f5] border border-[#332216]/10 space-y-2 text-xs">
                <div className="flex justify-between text-[#8e4e20]">
                  <span>ERC20 Allowance Check:</span>
                  <span className="font-bold text-emerald-700">Auto-Approve Enabled</span>
                </div>
                <div className="flex justify-between text-[#8e4e20]">
                  <span>Recipient Lender:</span>
                  <span className="font-mono font-bold text-[#332216]">{formatAddress(repayModalLoan.lender)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRepayModalLoan(null)}
                  className="flex-1 px-4 py-3 rounded-full border border-[#332216]/20 text-xs font-bold text-[#332216] hover:bg-[#ffe3d2]/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-[#BE5103] hover:bg-[#973e00] text-white px-4 py-3 rounded-full text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Processing Transaction...' : 'Confirm Repayment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
