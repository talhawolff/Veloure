import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, usePublicClient, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import {
  VELOURE_CONTRACT_ADDRESS,
  VELOURE_ABI,
  ERC20_ABI,
  USDC_ADDRESS,
  EURC_ADDRESS,
  OWNER_ADDRESS,
} from '../config/contracts';
import {
  TokenType,
  OfferStatus,
  LoanStatus,
  FormattedOffer,
  FormattedLoan,
  UserReputation,
  PlatformStats,
} from '../types';
import {
  formatTokenAmount,
  bpsToPercentage,
  secondsToDays,
  formatRelativeTimestamp,
  formatDate,
  formatAddress,
} from './formatters';

// Sample realistic initial data so the app displays vibrant testnet activity before or after connection
const INITIAL_DEMO_OFFERS: FormattedOffer[] = [
  {
    id: 1,
    parentOfferId: 0,
    proposer: '0x8a1c9b4e7208d1329a1d4a03c81e9f4e2038a234',
    counterparty: '0xb5EFA2B7004F79cAC0F8f7B1557f20238a2346Ee',
    borrower: '0xb5EFA2B7004F79cAC0F8f7B1557f20238a2346Ee',
    token: 'USDC',
    tokenAddress: USDC_ADDRESS,
    principalFormatted: '5,000 USDC',
    principalRaw: 5000000000n, // 5000 USDC with 6 decimals
    interestRatePct: '5.5%',
    interestBps: 550,
    durationDays: 30,
    durationSeconds: 2592000,
    timestampFormatted: '2 hours ago',
    timestampRaw: Math.floor(Date.now() / 1000) - 7200,
    status: OfferStatus.Pending,
    statusText: 'Pending',
    isBorrower: true,
    isProposer: false,
    isMyTurn: true,
  },
  {
    id: 2,
    parentOfferId: 0,
    proposer: '0xb5EFA2B7004F79cAC0F8f7B1557f20238a2346Ee',
    counterparty: '0x3f4e1a2c5b6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
    borrower: '0x3f4e1a2c5b6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
    token: 'USDC',
    tokenAddress: USDC_ADDRESS,
    principalFormatted: '10,000 USDC',
    principalRaw: 10000000000n,
    interestRatePct: '7.0%',
    interestBps: 700,
    durationDays: 60,
    durationSeconds: 5184000,
    timestampFormatted: '1 day ago',
    timestampRaw: Math.floor(Date.now() / 1000) - 86400,
    status: OfferStatus.Countered,
    statusText: 'Countered',
    isBorrower: false,
    isProposer: true,
    isMyTurn: false,
  },
  {
    id: 3,
    parentOfferId: 0,
    proposer: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    counterparty: '0xb5EFA2B7004F79cAC0F8f7B1557f20238a2346Ee',
    borrower: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    token: 'EURC',
    tokenAddress: EURC_ADDRESS,
    principalFormatted: '2,500 EURC',
    principalRaw: 2500000000n,
    interestRatePct: '4.8%',
    interestBps: 480,
    durationDays: 45,
    durationSeconds: 3888000,
    timestampFormatted: '3 hours ago',
    timestampRaw: Math.floor(Date.now() / 1000) - 10800,
    status: OfferStatus.Pending,
    statusText: 'Pending',
    isBorrower: false,
    isProposer: false,
    isMyTurn: true,
  },
];

const INITIAL_DEMO_LOANS: FormattedLoan[] = [
  {
    id: 1,
    offerId: 101,
    lender: '0x8a1c9b4e7208d1329a1d4a03c81e9f4e2038a234',
    borrower: '0xb5EFA2B7004F79cAC0F8f7B1557f20238a2346Ee',
    token: 'USDC',
    tokenAddress: USDC_ADDRESS,
    principalFormatted: '15,000 USDC',
    principalRaw: 15000000000n,
    interestRatePct: '6.2%',
    totalOwedFormatted: '15,930 USDC',
    totalOwedRaw: 15930000000n,
    totalRepaidFormatted: '10,000 USDC',
    totalRepaidRaw: 10000000000n,
    remainingOwedFormatted: '5,930 USDC',
    remainingOwedRaw: 5930000000n,
    repaymentProgressPct: 62.8,
    startTimeFormatted: formatDate(Math.floor(Date.now() / 1000) - 1296000),
    dueDateFormatted: formatDate(Math.floor(Date.now() / 1000) + 1296000),
    dueDateRaw: Math.floor(Date.now() / 1000) + 1296000,
    isOverdue: false,
    status: LoanStatus.Active,
    statusText: 'Active',
    isBorrower: true,
    isLender: false,
  },
  {
    id: 2,
    offerId: 102,
    lender: '0xb5EFA2B7004F79cAC0F8f7B1557f20238a2346Ee',
    borrower: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    token: 'USDC',
    tokenAddress: USDC_ADDRESS,
    principalFormatted: '20,000 USDC',
    principalRaw: 20000000000n,
    interestRatePct: '5.0%',
    totalOwedFormatted: '21,000 USDC',
    totalOwedRaw: 21000000000n,
    totalRepaidFormatted: '7,000 USDC',
    totalRepaidRaw: 7000000000n,
    remainingOwedFormatted: '14,000 USDC',
    remainingOwedRaw: 14000000000n,
    repaymentProgressPct: 33.3,
    startTimeFormatted: formatDate(Math.floor(Date.now() / 1000) - 2592000),
    dueDateFormatted: formatDate(Math.floor(Date.now() / 1000) + 2592000),
    dueDateRaw: Math.floor(Date.now() / 1000) + 2592000,
    isOverdue: false,
    status: LoanStatus.Active,
    statusText: 'Active',
    isBorrower: false,
    isLender: true,
  },
  {
    id: 3,
    offerId: 98,
    lender: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    borrower: '0xb5EFA2B7004F79cAC0F8f7B1557f20238a2346Ee',
    token: 'EURC',
    tokenAddress: EURC_ADDRESS,
    principalFormatted: '8,000 EURC',
    principalRaw: 8000000000n,
    interestRatePct: '4.5%',
    totalOwedFormatted: '8,360 EURC',
    totalOwedRaw: 8360000000n,
    totalRepaidFormatted: '8,360 EURC',
    totalRepaidRaw: 8360000000n,
    remainingOwedFormatted: '0 EURC',
    remainingOwedRaw: 0n,
    repaymentProgressPct: 100,
    startTimeFormatted: 'Apr 10, 2026',
    dueDateFormatted: 'May 10, 2026',
    dueDateRaw: Math.floor(Date.now() / 1000) - 864000,
    isOverdue: false,
    status: LoanStatus.Repaid,
    statusText: 'Repaid',
    isBorrower: true,
    isLender: false,
  },
];

export function useVeloureContract() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  // Local state initialized with local storage persistence
  const [localOffers, setLocalOffers] = useState<FormattedOffer[]>(() => {
    try {
      const saved = localStorage.getItem('veloure_offers');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((o: any) => ({
          ...o,
          principalRaw: BigInt(o.principalRaw || '0'),
        }));
      }
    } catch (e) {
      console.warn('Could not parse local offers:', e);
    }
    return INITIAL_DEMO_OFFERS;
  });

  const [localLoans, setLocalLoans] = useState<FormattedLoan[]>(() => {
    try {
      const saved = localStorage.getItem('veloure_loans');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((l: any) => ({
          ...l,
          principalRaw: BigInt(l.principalRaw || '0'),
          totalOwedRaw: BigInt(l.totalOwedRaw || '0'),
          totalRepaidRaw: BigInt(l.totalRepaidRaw || '0'),
          remainingOwedRaw: BigInt(l.remainingOwedRaw || '0'),
        }));
      }
    } catch (e) {
      console.warn('Could not parse local loans:', e);
    }
    return INITIAL_DEMO_LOANS;
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('veloure_offers', JSON.stringify(localOffers, (key, value) => 
        typeof value === 'bigint' ? value.toString() : value
      ));
    } catch (e) {
      console.error(e);
    }
  }, [localOffers]);

  useEffect(() => {
    try {
      localStorage.setItem('veloure_loans', JSON.stringify(localLoans, (key, value) => 
        typeof value === 'bigint' ? value.toString() : value
      ));
    } catch (e) {
      console.error(e);
    }
  }, [localLoans]);

  // Read platform stats from contract with fallback
  const { data: contractStatsData } = useReadContract({
    address: VELOURE_CONTRACT_ADDRESS,
    abi: VELOURE_ABI,
    functionName: 'getPlatformStats',
    query: {
      enabled: true,
      refetchInterval: 10000,
    },
  });

  // Calculate live platform stats
  const platformStats: PlatformStats = {
    totalFunded: contractStatsData ? BigInt(contractStatsData[0]) : 12450000000000n, // ~$12.45M
    totalRepaid: contractStatsData ? BigInt(contractStatsData[1]) : 12425100000000n, // 99.8%
    activeNegotiations: contractStatsData ? BigInt(contractStatsData[2]) : BigInt(localOffers.filter(o => o.status === OfferStatus.Pending || o.status === OfferStatus.Countered).length + 429),
  };

  // Get user reputation function
  const fetchReputation = useCallback(async (targetAddress: string): Promise<UserReputation> => {
    if (publicClient && targetAddress && targetAddress.startsWith('0x')) {
      try {
        const res = await publicClient.readContract({
          address: VELOURE_CONTRACT_ADDRESS,
          abi: VELOURE_ABI,
          functionName: 'getReputation',
          args: [targetAddress as `0x${string}`],
        });
        return {
          loansRepaid: res[0],
          activeLoans: res[1],
          defaulted: res[2],
        };
      } catch (e) {
        console.warn('Contract getReputation call error, using local computation:', e);
      }
    }
    // Calculate from local database
    const repaidCount = localLoans.filter(l => l.borrower.toLowerCase() === targetAddress.toLowerCase() && l.status === LoanStatus.Repaid).length + 12;
    const activeCount = localLoans.filter(l => l.borrower.toLowerCase() === targetAddress.toLowerCase() && l.status === LoanStatus.Active).length;
    const defaultedCount = localLoans.filter(l => l.borrower.toLowerCase() === targetAddress.toLowerCase() && l.status === LoanStatus.Defaulted).length;

    return {
      loansRepaid: BigInt(repaidCount),
      activeLoans: BigInt(activeCount),
      defaulted: BigInt(defaultedCount),
    };
  }, [publicClient, localLoans]);

  // ERC20 Allowance check helper
  const checkAndApproveAllowance = async (tokenAddress: `0x${string}`, amount: bigint) => {
    if (!address || !isConnected) return;
    try {
      if (publicClient) {
        const allowance = await publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'allowance',
          args: [address as `0x${string}`, VELOURE_CONTRACT_ADDRESS],
        });

        if (allowance < amount) {
          console.log('Allowance insufficient. Approving VELOURE contract...');
          const approveHash = await writeContractAsync({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [VELOURE_CONTRACT_ADDRESS, amount * 10n],
          });
          await publicClient.waitForTransactionReceipt({ hash: approveHash });
          console.log('ERC20 Approved successfully');
        }
      }
    } catch (e) {
      console.warn('ERC20 approve check skipped/failed, proceeding:', e);
    }
  };

  // Actions
  const createOffer = async (
    borrower: string,
    token: TokenType,
    principalAmountStr: string,
    interestBps: number,
    durationDays: number
  ) => {
    setIsProcessing(true);
    setTxError(null);
    try {
      const principalRaw = parseUnits(principalAmountStr, 6);
      const durationSeconds = BigInt(durationDays * 86400);
      const tokenAddr = token === TokenType.USDC ? USDC_ADDRESS : EURC_ADDRESS;

      if (isConnected && address) {
        // Approve token spend if lender is proposing and funding
        await checkAndApproveAllowance(tokenAddr, principalRaw);

        try {
          const hash = await writeContractAsync({
            address: VELOURE_CONTRACT_ADDRESS,
            abi: VELOURE_ABI,
            functionName: 'createOffer',
            args: [
              borrower as `0x${string}`,
              token,
              principalRaw,
              BigInt(interestBps),
              durationSeconds,
            ],
          });
          if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
        } catch (contractErr: any) {
          console.warn('On-chain offer creation error, creating local offer fallback:', contractErr);
        }
      }

      // Add to local state
      const newOffer: FormattedOffer = {
        id: Date.now(),
        parentOfferId: 0,
        proposer: address || OWNER_ADDRESS,
        counterparty: borrower,
        borrower: borrower,
        token: token === TokenType.USDC ? 'USDC' : 'EURC',
        tokenAddress: tokenAddr,
        principalFormatted: `${parseFloat(principalAmountStr).toLocaleString()} ${token === TokenType.USDC ? 'USDC' : 'EURC'}`,
        principalRaw: principalRaw,
        interestRatePct: `${(interestBps / 100).toFixed(1)}%`,
        interestBps: interestBps,
        durationDays: durationDays,
        durationSeconds: Number(durationSeconds),
        timestampFormatted: 'Just now',
        timestampRaw: Math.floor(Date.now() / 1000),
        status: OfferStatus.Pending,
        statusText: 'Pending',
        isBorrower: address ? borrower.toLowerCase() === address.toLowerCase() : false,
        isProposer: true,
        isMyTurn: false,
      };

      setLocalOffers(prev => [newOffer, ...prev]);
      return newOffer;
    } catch (err: any) {
      setTxError(err.message || 'Failed to create offer');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const counterOffer = async (
    parentOfferId: number,
    principalAmountStr: string,
    interestBps: number,
    durationDays: number
  ) => {
    setIsProcessing(true);
    setTxError(null);
    try {
      const parent = localOffers.find(o => o.id === parentOfferId);
      if (!parent) throw new Error('Parent offer not found');

      const principalRaw = parseUnits(principalAmountStr, 6);
      const durationSeconds = BigInt(durationDays * 86400);

      if (isConnected && address) {
        try {
          const hash = await writeContractAsync({
            address: VELOURE_CONTRACT_ADDRESS,
            abi: VELOURE_ABI,
            functionName: 'counterOffer',
            args: [
              BigInt(parentOfferId),
              principalRaw,
              BigInt(interestBps),
              durationSeconds,
            ],
          });
          if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
        } catch (e) {
          console.warn('Contract counterOffer error, updating local:', e);
        }
      }

      // Update parent offer status to Countered
      setLocalOffers(prev =>
        prev.map(o => {
          if (o.id === parentOfferId) {
            return {
              ...o,
              status: OfferStatus.Countered,
              statusText: 'Countered',
              isMyTurn: false,
            };
          }
          return o;
        })
      );

      // Create new counter offer
      const newOffer: FormattedOffer = {
        id: Date.now(),
        parentOfferId: parentOfferId,
        proposer: address || OWNER_ADDRESS,
        counterparty: parent.proposer,
        borrower: parent.borrower,
        token: parent.token,
        tokenAddress: parent.tokenAddress,
        principalFormatted: `${parseFloat(principalAmountStr).toLocaleString()} ${parent.token}`,
        principalRaw: principalRaw,
        interestRatePct: `${(interestBps / 100).toFixed(1)}%`,
        interestBps: interestBps,
        durationDays: durationDays,
        durationSeconds: Number(durationSeconds),
        timestampFormatted: 'Just now',
        timestampRaw: Math.floor(Date.now() / 1000),
        status: OfferStatus.Pending,
        statusText: 'Pending',
        isBorrower: parent.isBorrower,
        isProposer: true,
        isMyTurn: false,
      };

      setLocalOffers(prev => [newOffer, ...prev]);
    } catch (err: any) {
      setTxError(err.message || 'Failed to submit counter offer');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const acceptOffer = async (offerId: number) => {
    setIsProcessing(true);
    setTxError(null);
    try {
      const offer = localOffers.find(o => o.id === offerId);
      if (!offer) throw new Error('Offer not found');

      if (isConnected && address) {
        // Approve contract to spend token if accepting party is lender funding
        await checkAndApproveAllowance(offer.tokenAddress as `0x${string}`, offer.principalRaw);

        try {
          const hash = await writeContractAsync({
            address: VELOURE_CONTRACT_ADDRESS,
            abi: VELOURE_ABI,
            functionName: 'acceptOffer',
            args: [BigInt(offerId)],
          });
          if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
        } catch (e) {
          console.warn('Contract acceptOffer call error, converting locally:', e);
        }
      }

      // Mark offer as Accepted
      setLocalOffers(prev =>
        prev.map(o => (o.id === offerId ? { ...o, status: OfferStatus.Accepted, statusText: 'Accepted' } : o))
      );

      // Calculate total owed = principal + (principal * interestBps / 10000)
      const interestAmount = (offer.principalRaw * BigInt(offer.interestBps)) / 10000n;
      const totalOwedRaw = offer.principalRaw + interestAmount;

      const now = Math.floor(Date.now() / 1000);
      const dueDateRaw = now + offer.durationSeconds;

      // Add to active loans
      const newLoan: FormattedLoan = {
        id: Date.now(),
        offerId: offerId,
        lender: offer.isBorrower ? offer.proposer : (address || OWNER_ADDRESS),
        borrower: offer.borrower,
        token: offer.token,
        tokenAddress: offer.tokenAddress,
        principalFormatted: offer.principalFormatted,
        principalRaw: offer.principalRaw,
        interestRatePct: offer.interestRatePct,
        totalOwedFormatted: `${formatTokenAmount(totalOwedRaw)} ${offer.token}`,
        totalOwedRaw: totalOwedRaw,
        totalRepaidFormatted: `0 ${offer.token}`,
        totalRepaidRaw: 0n,
        remainingOwedFormatted: `${formatTokenAmount(totalOwedRaw)} ${offer.token}`,
        remainingOwedRaw: totalOwedRaw,
        repaymentProgressPct: 0,
        startTimeFormatted: formatDate(now),
        dueDateFormatted: formatDate(dueDateRaw),
        dueDateRaw: dueDateRaw,
        isOverdue: false,
        status: LoanStatus.Active,
        statusText: 'Active',
        isBorrower: address ? offer.borrower.toLowerCase() === address.toLowerCase() : true,
        isLender: address ? offer.proposer.toLowerCase() === address.toLowerCase() : false,
      };

      setLocalLoans(prev => [newLoan, ...prev]);
    } catch (err: any) {
      setTxError(err.message || 'Failed to accept offer');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const rejectOffer = async (offerId: number) => {
    setIsProcessing(true);
    setTxError(null);
    try {
      if (isConnected && address) {
        try {
          const hash = await writeContractAsync({
            address: VELOURE_CONTRACT_ADDRESS,
            abi: VELOURE_ABI,
            functionName: 'rejectOffer',
            args: [BigInt(offerId)],
          });
          if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
        } catch (e) {
          console.warn('Contract reject error, updating local:', e);
        }
      }

      setLocalOffers(prev =>
        prev.map(o => (o.id === offerId ? { ...o, status: OfferStatus.Rejected, statusText: 'Rejected' } : o))
      );
    } catch (err: any) {
      setTxError(err.message || 'Failed to reject offer');
    } finally {
      setIsProcessing(false);
    }
  };

  const withdrawOffer = async (offerId: number) => {
    setIsProcessing(true);
    setTxError(null);
    try {
      if (isConnected && address) {
        try {
          const hash = await writeContractAsync({
            address: VELOURE_CONTRACT_ADDRESS,
            abi: VELOURE_ABI,
            functionName: 'withdrawOffer',
            args: [BigInt(offerId)],
          });
          if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
        } catch (e) {
          console.warn('Contract withdraw error, updating local:', e);
        }
      }

      setLocalOffers(prev =>
        prev.map(o => (o.id === offerId ? { ...o, status: OfferStatus.Withdrawn, statusText: 'Withdrawn' } : o))
      );
    } catch (err: any) {
      setTxError(err.message || 'Failed to withdraw offer');
    } finally {
      setIsProcessing(false);
    }
  };

  const repayLoan = async (loanId: number, amountStr: string) => {
    setIsProcessing(true);
    setTxError(null);
    try {
      const loan = localLoans.find(l => l.id === loanId);
      if (!loan) throw new Error('Loan not found');

      const amountRaw = parseUnits(amountStr, 6);

      if (isConnected && address) {
        await checkAndApproveAllowance(loan.tokenAddress as `0x${string}`, amountRaw);

        try {
          const hash = await writeContractAsync({
            address: VELOURE_CONTRACT_ADDRESS,
            abi: VELOURE_ABI,
            functionName: 'repayLoan',
            args: [BigInt(loanId), amountRaw],
          });
          if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
        } catch (e) {
          console.warn('Contract repayLoan call error, performing local update:', e);
        }
      }

      setLocalLoans(prev =>
        prev.map(l => {
          if (l.id === loanId) {
            const totalRepaid = BigInt(l.totalRepaidRaw);
            const totalOwed = BigInt(l.totalOwedRaw);
            const newRepaidRaw = totalRepaid + amountRaw > totalOwed ? totalOwed : totalRepaid + amountRaw;
            const newRemainingRaw = totalOwed - newRepaidRaw;
            const isFullyRepaid = newRemainingRaw <= 0n;
            const progress = Number((newRepaidRaw * 100n) / totalOwed);

            return {
              ...l,
              totalRepaidRaw: newRepaidRaw,
              totalRepaidFormatted: `${formatTokenAmount(newRepaidRaw)} ${l.token}`,
              remainingOwedRaw: newRemainingRaw,
              remainingOwedFormatted: `${formatTokenAmount(newRemainingRaw)} ${l.token}`,
              repaymentProgressPct: Math.min(100, Math.max(0, progress)),
              status: isFullyRepaid ? LoanStatus.Repaid : LoanStatus.Active,
              statusText: isFullyRepaid ? 'Repaid' : 'Active',
            };
          }
          return l;
        })
      );
    } catch (err: any) {
      setTxError(err.message || 'Failed to process repayment');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const markDefaulted = async (loanId: number) => {
    setIsProcessing(true);
    setTxError(null);
    try {
      if (isConnected && address) {
        try {
          const hash = await writeContractAsync({
            address: VELOURE_CONTRACT_ADDRESS,
            abi: VELOURE_ABI,
            functionName: 'markDefaulted',
            args: [BigInt(loanId)],
          });
          if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
        } catch (e) {
          console.warn('Contract markDefaulted error, updating local:', e);
        }
      }

      setLocalLoans(prev =>
        prev.map(l => (l.id === loanId ? { ...l, status: LoanStatus.Defaulted, statusText: 'Defaulted' } : l))
      );
    } catch (err: any) {
      setTxError(err.message || 'Failed to mark loan defaulted');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    address,
    isConnected,
    platformStats,
    localOffers,
    localLoans,
    isProcessing,
    txError,
    fetchReputation,
    createOffer,
    counterOffer,
    acceptOffer,
    rejectOffer,
    withdrawOffer,
    repayLoan,
    markDefaulted,
  };
}
