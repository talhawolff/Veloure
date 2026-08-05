import { formatUnits, parseUnits } from 'viem';
import { TokenType, OfferStatus, LoanStatus } from '../types';

export const TOKEN_DECIMALS = 6;

export function formatAddress(address: string, chars = 4): string {
  if (!address || address.length < 10) return address || '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function formatTokenAmount(amountRaw: bigint, decimals = TOKEN_DECIMALS): string {
  const formatted = formatUnits(amountRaw, decimals);
  const num = parseFloat(formatted);
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function parseTokenAmount(amountStr: string, decimals = TOKEN_DECIMALS): bigint {
  if (!amountStr || isNaN(Number(amountStr))) return 0n;
  try {
    return parseUnits(amountStr, decimals);
  } catch {
    return 0n;
  }
}

export function bpsToPercentage(bps: bigint | number): string {
  const bpsNum = typeof bps === 'bigint' ? Number(bps) : bps;
  return (bpsNum / 100).toFixed(1) + '%';
}

export function percentageToBps(pctStr: string): bigint {
  const num = parseFloat(pctStr);
  if (isNaN(num)) return 0n;
  return BigInt(Math.round(num * 100));
}

export function secondsToDays(seconds: bigint | number): number {
  const sec = typeof seconds === 'bigint' ? Number(seconds) : seconds;
  return Math.round(sec / 86400);
}

export function daysToSeconds(days: number): bigint {
  return BigInt(days * 86400);
}

export function formatRelativeTimestamp(timestampSec: bigint | number): string {
  const sec = typeof timestampSec === 'bigint' ? Number(timestampSec) : timestampSec;
  if (!sec) return 'Just now';
  const now = Math.floor(Date.now() / 1000);
  const diff = now - sec;

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  
  const date = new Date(sec * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDate(timestampSec: bigint | number): string {
  const sec = typeof timestampSec === 'bigint' ? Number(timestampSec) : timestampSec;
  if (!sec) return 'N/A';
  return new Date(sec * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getTrustScore(loansRepaid: number, activeLoans: number, defaulted: number): {
  score: string;
  badgeColor: string;
  bgLight: string;
} {
  if (defaulted > 0) {
    return { score: 'High Risk', badgeColor: 'text-red-700 bg-red-100 border-red-300', bgLight: 'bg-red-50' };
  }
  if (loansRepaid >= 10) {
    return { score: 'Excellent', badgeColor: 'text-amber-800 bg-amber-100 border-amber-300', bgLight: 'bg-amber-50' };
  }
  if (loansRepaid >= 3) {
    return { score: 'Good', badgeColor: 'text-emerald-800 bg-emerald-100 border-emerald-300', bgLight: 'bg-emerald-50' };
  }
  if (loansRepaid > 0) {
    return { score: 'Building', badgeColor: 'text-blue-800 bg-blue-100 border-blue-300', bgLight: 'bg-blue-50' };
  }
  return { score: 'New Borrower', badgeColor: 'text-stone-700 bg-stone-100 border-stone-300', bgLight: 'bg-stone-50' };
}
